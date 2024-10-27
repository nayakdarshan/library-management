import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: string;
  borrowingLimit: number;
}

interface Book {
  id: string;
  title: string;
  author: string;
  availableCopies: number;
}

interface Transaction {
  id: string;
  userId: string;
  bookId: string;
  dateBorrowed?: Date;
  dateReturned?: Date;
}

interface LibraryDB extends DBSchema {
  users: {
    key: string;
    value: User;
  };
  books: {
    key: string;
    value: Book;
  };
  transactions: {
    key: string;
    value: Transaction;
  };
}

@Injectable({
  providedIn: 'root',
})
export class IndexedDbService {
  private dbPromise: Promise<IDBPDatabase<LibraryDB>> | undefined;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.dbPromise = openDB<LibraryDB>('libraryDB', 4, {
        upgrade(db) {
          db.createObjectStore('users', { keyPath: 'id' });
          db.createObjectStore('books', { keyPath: 'id' });
          db.createObjectStore('transactions', { keyPath: 'id' });
        },
      });
    }
  }

  // User operations
  async addUser(user: User) {
    if (!this.dbPromise) throw new Error('IndexedDB not supported in this environment.');
    const db = await this.dbPromise;
    return db.add('users', user);
  }

  async getAllUsers(): Promise<User[]> {
    if (!this.dbPromise) return [];
    const db = await this.dbPromise;
    return db.getAll('users');
  }

  async updateUser(updatedUser: User): Promise<void> {
    if (!this.dbPromise) throw new Error('IndexedDB not supported in this environment.');
    const db = await this.dbPromise;
    const existingUser = await this.getUserById(updatedUser.id);

    if (existingUser) {
      const mergedUser = { ...existingUser, ...updatedUser };
      const transaction = db.transaction('users', 'readwrite');
      const store = transaction.objectStore('users');
      store.put(mergedUser);
    } else {
      throw new Error('User not found');
    }
  }

  async deleteUser(userId: string): Promise<void> {
    if (!this.dbPromise) throw new Error('IndexedDB not supported in this environment.');
    const db = await this.dbPromise;
    return db.delete('users', userId);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    if (!this.dbPromise) return undefined;
    const db = await this.dbPromise;
    const allUsers = await db.getAll('users');
    return allUsers.find((user) => user.username === username);
  }

  async getUserById(userId: string): Promise<User | undefined> {
    if (!this.dbPromise) return undefined;
    const db = await this.dbPromise;
    return db.get('users', userId);
  }

  // Book operations
  async addBook(book: Book) {
    if (!this.dbPromise) throw new Error('IndexedDB not supported in this environment.');
    const db = await this.dbPromise;
    return db.add('books', book);
  }

  async updateBook(book: Book) {
    if (!this.dbPromise) throw new Error('IndexedDB not supported in this environment.');
    const db = await this.dbPromise;
    await db.put('books', book);
  }

  async deleteBook(bookId: string) {
    if (!this.dbPromise) throw new Error('IndexedDB not supported in this environment.');
    const db = await this.dbPromise;
    return db.delete('books', bookId);
  }

  async getAllBooks(): Promise<Book[]> {
    if (!this.dbPromise) return [];
    const db = await this.dbPromise;
    return db.getAll('books');
  }

  async getBookById(bookId: string): Promise<Book | undefined> {
    if (!this.dbPromise) return undefined;
    const db = await this.dbPromise;
    return db.get('books', bookId);
  }

  // Transaction operations
  async addTransaction(transaction: Transaction): Promise<void> {
    if (!this.dbPromise) throw new Error('IndexedDB not supported in this environment.');
    const db = await this.dbPromise;
    await db.add('transactions', transaction);
  }

  async borrowBook(userId: string, bookId: string): Promise<void> {
    if (!this.dbPromise) throw new Error('IndexedDB not supported in this environment.');
    const db = await this.dbPromise;
    const book = await this.getBookById(bookId);
    const user = await this.getUserById(userId);

    if (!user) throw new Error('User not found.');
    if (!book) throw new Error('Book not found.');

    if (book.availableCopies > 0) {
      if (user.borrowingLimit > 0) {
        const transaction: Transaction = {
          id: this.generateUniqueId(),
          userId: userId,
          bookId: bookId,
          dateBorrowed: new Date(),
        };

        await this.addTransaction(transaction);
        book.availableCopies--;
        await this.updateBook(book);
        user.borrowingLimit--;
        await this.updateUser(user);
      } else {
        throw new Error('User has reached their borrowing limit.');
      }
    } else {
      throw new Error('No copies available to borrow.');
    }
  }

  async returnBook(transactionId: string): Promise<void> {
    if (!this.dbPromise) throw new Error('IndexedDB not supported in this environment.');
    const db = await this.dbPromise;
    const transaction = await db.get('transactions', transactionId);
    
    if (!transaction) throw new Error('Transaction not found.');
    
    transaction.dateReturned = new Date();
    await db.put('transactions', transaction);
  
    const book = await this.getBookById(transaction.bookId);
    if (book) {
      book.availableCopies++;
      await this.updateBook(book);
    } else {
      throw new Error('Book not found.');
    }

    const user = await this.getUserById(transaction.userId);
    if (user) {
      user.borrowingLimit++;
      await this.updateUser(user);
    } else {
      throw new Error('User not found.');
    }
  }

  async getAllTransactions(): Promise<Transaction[]> {
    if (!this.dbPromise) return [];
    const db = await this.dbPromise;
    return db.getAll('transactions');
  }

  async getTransactionsByUserId(userId: string): Promise<Transaction[]> {
    const transactions = await this.getAllTransactions();
    return transactions.filter((transaction) => transaction.userId === userId);
  }

  async getActiveTransactionsByUserId(userId: string): Promise<Transaction[]> {
    const transactions = await this.getTransactionsByUserId(userId);
    return transactions.filter((transaction) => !transaction.dateReturned);
  }

  private generateUniqueId(): string {
    return 'id-' + Date.now() + Math.random().toString(36).substring(2);
  }

  async updateTransaction(transactionId: string, transaction: Transaction): Promise<void> {
    if (!this.dbPromise) throw new Error('IndexedDB not supported in this environment.');
    const db = await this.dbPromise;
    await db.put('transactions', transaction);
  }

  async getTransactionId(userId: string, bookId: string): Promise<string | null> {
    const transactions = await this.getAllTransactions();
    const transaction = transactions.find(t => t.userId === userId && t.bookId === bookId && !t.dateReturned);
    return transaction ? transaction.id : null;
  }

  async getUserNameById(userId: string): Promise<string | undefined> {
    const user = await this.getUserById(userId);
    return user ? user.username : undefined;
  }

  async getBookNameById(bookId: string): Promise<string | undefined> {
    const book = await this.getBookById(bookId);
    return book ? book.title : undefined;
  }
}
