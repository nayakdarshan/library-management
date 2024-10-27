import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IndexedDbService } from './indexed-db.service';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private transactionsSubject = new BehaviorSubject<any[]>([]);
  transactions$ = this.transactionsSubject.asObservable();

  constructor(private indexedDbService: IndexedDbService) {
    this.loadTransactions();
  }

  async loadTransactions() {
    const transactions = await this.indexedDbService.getAllTransactions();
    this.transactionsSubject.next(transactions);
  }

  async getAllTransactions(): Promise<any[]> {
    return this.indexedDbService.getAllTransactions();
  }

  async getTransactionsByUserId(userId: string): Promise<any[]> {
    const transactions = await this.indexedDbService.getAllTransactions();
    return transactions.filter((transaction: any) => transaction.userId === userId);
  }

  async getTransactionsByBookId(bookId: string): Promise<{ borrowedBy: any[]; returnedBy: any[] }> {
    const transactions = await this.indexedDbService.getAllTransactions();
    const borrowedBy = transactions.filter((transaction: any) => transaction.bookId === bookId && !transaction.dateReturned);
    const returnedBy = transactions.filter((transaction: any) => transaction.bookId === bookId && transaction.dateReturned);
    return { borrowedBy, returnedBy };
  }
  async getTransactionDetailsWithNames(transactions: any[]): Promise<any[]> {
    const transactionDetails = await Promise.all(transactions.map(async (transaction) => {
      const userName = await this.indexedDbService.getUserNameById(transaction.userId);
      const bookName = await this.indexedDbService.getBookNameById(transaction.bookId);
      
      return {
        ...transaction,
        userName: userName || 'Unknown User',
        bookName: bookName || 'Unknown Book',
      };
    }));

    return transactionDetails;
  }
}
