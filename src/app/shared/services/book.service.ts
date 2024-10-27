import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IndexedDbService } from './indexed-db.service';
import { CommonServiceService } from './common-service.service';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private booksSubject = new BehaviorSubject<any[]>([]);
  books$ = this.booksSubject.asObservable();

  constructor(
    private indexedDbService: IndexedDbService,
    private commonService: CommonServiceService
  ) {
    this.loadBooks();
  }

  private async loadBooks() {
    try {
      const books = await this.indexedDbService.getAllBooks();
      this.booksSubject.next(books);
    } catch (error) {
      this.commonService.displayFailureSnackBar('Error loading books: ' + error);
    }
  }

  async addBook(book: any) {
    try {
      await this.indexedDbService.addBook(book);
      this.loadBooks();
    } catch (error) {
      this.commonService.displayFailureSnackBar('Error adding book: ' + error);
    }
  }

  async editBook(book: any) {
    try {
      await this.indexedDbService.updateBook(book);
      this.loadBooks();
    } catch (error) {
      this.commonService.displayFailureSnackBar('Error editing book: ' + error);
    }
  }

  async deleteBook(bookId: string) {
    try {
      await this.indexedDbService.deleteBook(bookId);
      this.loadBooks();
    } catch (error) {
      this.commonService.displayFailureSnackBar('Error deleting book: ' + error);
    }
  }

  async borrowBook(userId: string, bookId: string): Promise<void> {
    try {
      const book = await this.indexedDbService.getBookById(bookId);
      const user = await this.indexedDbService.getUserById(userId);

      if (!user || !book) {
        throw new Error('User or Book not found.');
      }

      const transactions = await this.indexedDbService.getTransactionsByUserId(userId);
      const hasBorrowed = transactions.some(
        (transaction:any) => transaction.bookId === bookId && !transaction.dateReturned
      );

      if (hasBorrowed) {
        throw new Error('You have already borrowed this book.');
      }

      if (book.availableCopies > 0 && user.borrowingLimit > 0) {
        const transaction: any = {
          id: new Date().toISOString(),
          userId,
          bookId,
          dateBorrowed: new Date(),
          dateReturned: null,
        };

        await this.indexedDbService.addTransaction(transaction);
        book.availableCopies--;
        await this.indexedDbService.updateBook(book);
        user.borrowingLimit--;
        await this.indexedDbService.updateUser(user);
      } else {
        throw new Error('No copies available to borrow or borrowing limit reached.');
      }
    } catch (error) {
      this.commonService.displayFailureSnackBar('Error borrowing book: ' + error);
      throw error;
    }
  }

  async returnBook(userId: string, bookId: string): Promise<void> {
    try {
      const allTransactions = await this.indexedDbService.getAllTransactions();
      const transaction = allTransactions.find(t => t.userId === userId && t.bookId === bookId && !t.dateReturned);

      if (!transaction) {
        this.commonService.displayFailureSnackBar('Transaction not found for user: ' + userId + ' and book: ' + bookId);
        throw new Error('Transaction not found.');
      }

      transaction.dateReturned = new Date();
      await this.indexedDbService.updateTransaction(transaction.id, transaction);

      const book = await this.indexedDbService.getBookById(bookId);
      if (book) {
        book.availableCopies += 1;
        await this.indexedDbService.updateBook(book);
      } else {
        this.commonService.displayFailureSnackBar('Book not found for ID: ' + bookId);
        throw new Error('Book not found.');
      }

      const user = await this.indexedDbService.getUserById(userId);
      if (user) {
        user.borrowingLimit += 1;
        await this.indexedDbService.updateUser(user);
      } else {
        this.commonService.displayFailureSnackBar('User not found: ' + userId);
        throw new Error('User not found.');
      }
    } catch (error) {
      this.commonService.displayFailureSnackBar('Error returning the book: ' + error);
      throw error;
    }
  }


  async getAvailableBooksForUser(userId: string): Promise<any[]> {
    try {
      return await this.indexedDbService.getAvailableBooksForUser(userId);
    } catch (error) {
      this.commonService.displayFailureSnackBar('Error fetching available books for user: ' + error);
      throw error;
    }
  }
  

  async getBorrowedBooksByUser(userId: string): Promise<any[]> {
    try {
      const activeTransactions = await this.indexedDbService.getActiveTransactionsByUserId(userId);
      const borrowedBooksPromises = activeTransactions.map((transaction) => 
        this.indexedDbService.getBookById(transaction.bookId)
      );
      return Promise.all(borrowedBooksPromises);
    } catch (error) {
      this.commonService.displayFailureSnackBar('Error fetching borrowed books by user: ' + error);
      throw error;
    }
  }

  async updateBook(book: any) {
    await this.indexedDbService.updateBook(book);
    this.loadBooks();
  }

  async updateUser(user: any): Promise<void> {
    await this.indexedDbService.updateUser(user);
  }

  private generateUniqueId(): string {
    return 'id-' + Date.now() + Math.random().toString(36).substring(2);
  }
}
