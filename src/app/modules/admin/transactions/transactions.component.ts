import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { TransactionService } from '../../../shared/services/transaction.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss'
})
export class TransactionsComponent {
  displayedColumns: string[] = ['id', 'dateBorrowed', 'bookName', 'userName', 'status'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private transactionService: TransactionService) {}

  async ngOnInit() {
    await this.loadTransactions();
  }

  async loadTransactions() {
    const transactions = await this.transactionService.getAllTransactions();
    const transactionDetails = await this.transactionService.getTransactionDetailsWithNames(transactions);

    transactionDetails.sort((a, b) => new Date(b.dateBorrowed).getTime() - new Date(a.dateBorrowed).getTime());

    this.dataSource.data = transactionDetails;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.sort.sort({ id: 'dateBorrowed', start: 'desc', disableClear: true });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
