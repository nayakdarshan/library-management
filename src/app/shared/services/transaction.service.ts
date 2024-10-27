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
    return this.indexedDbService.getTransactionsByUserId(userId);
  }

  async getTransactionsByBookId(bookId: string): Promise<{ borrowedBy: any[]; returnedBy: any[] }> {
    const transactions = await this.indexedDbService.getAllTransactions();
    const userPromises = transactions.map(transaction => this.indexedDbService.getUserNameById(transaction.userId));
    const bookPromise = this.indexedDbService.getBookNameById(bookId);
    const userNames = await Promise.all(userPromises);
    const bookName = await bookPromise;
    const borrowedBy = transactions.filter(transaction => transaction.bookId === bookId && !transaction.dateReturned)
      .map((transaction, index) => ({
        ...transaction,
        userName: userNames[index], 
        bookName: bookName
      }));
  
    const returnedBy = transactions.filter(transaction => transaction.bookId === bookId && transaction.dateReturned)
      .map((transaction, index) => ({
        ...transaction,
        userName: userNames[index + borrowedBy.length],
        bookName: bookName 
      }));
  
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
  async getUserNameById(userId:any){
    return this.indexedDbService.getUserNameById(userId);
  }
  async getBookNameById(userId:any){
    return this.indexedDbService.getBookNameById(userId);
  }
}
