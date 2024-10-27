import { Component, Inject } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-borrowings-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
  ],
  templateUrl: './borrowings-modal.component.html',
  styleUrl: './borrowings-modal.component.scss'
})
export class BorrowingsModalComponent {
  borrowedBooks: any[] = [];
  returnedBooks: any[] = [];
  userName: any = '';

  constructor(
    public dialogRef: MatDialogRef<BorrowingsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userId: string, bookId: string },
    private transactionService: TransactionService
  ) {
  }

  ngOnInit(): void {
    if(this.data.userId){
      this.loadBorrowingsByUserId();
    }else if(this.data.bookId){
       this.loadBorrowingsByBookId();
    }
  }

  async loadBorrowingsByUserId(): Promise<void> {
    try {
      this.userName = await this.transactionService.getUserNameById(this.data.userId);
      const transactions = await this.transactionService.getTransactionsByUserId(this.data.userId);
      const current = transactions.filter(transaction => !transaction.dateReturned);
      const previous = transactions.filter(transaction => !!transaction.dateReturned);
      this.borrowedBooks = await Promise.all(current.map(async (transaction) => ({
        name: await this.transactionService.getBookNameById(transaction.bookId),
        borrowDate: transaction.dateBorrowed,
      })));

      this.returnedBooks = await Promise.all(previous.map(async (transaction) => ({
        name: await this.transactionService.getBookNameById(transaction.bookId),
        returnDate: transaction.dateReturned,
      })));
    } catch (error) {
      console.error('Error loading borrowings:', error);
    }
  }
   
  async loadBorrowingsByBookId(): Promise<void> {
    try {
      this.userName = await this.transactionService.getBookNameById(this.data.bookId);
      const transactions = await this.transactionService.getTransactionsByBookId(this.data.bookId);
      this.borrowedBooks = await Promise.all(transactions.borrowedBy.map(async (transaction) => ({
        name: await this.transactionService.getUserNameById(transaction.userId),
        borrowDate: transaction.dateBorrowed,
      })));
      this.returnedBooks = await Promise.all(transactions.returnedBy.map(async (transaction) => ({
        name: await this.transactionService.getUserNameById(transaction.userId), 
        returnDate: transaction.dateReturned,
      })));
    } catch (error) {
      console.error('Error loading borrowings by book ID:', error);
    }
  }
  
  closeModal(): void {
    this.dialogRef.close(); 
  }
}
