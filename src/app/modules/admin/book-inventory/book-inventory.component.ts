import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BookService } from '../../../shared/services/book.service';
import { MatTableModule } from '@angular/material/table';
import { AddEditBookDialogComponent } from '../../../shared/components/add-edit-book-dialog/add-edit-book-dialog.component';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { BorrowingsModalComponent } from '../../../shared/components/borrowings-modal/borrowings-modal.component';

interface Book {
  id: string;
  title: string;
  author: string;
  availableCopies: number;
  imageSrc: string;
}

@Component({
  selector: 'app-book-inventory',
  templateUrl: './book-inventory.component.html',
  styleUrls: ['./book-inventory.component.scss'],
  imports: [
    MatTableModule
  ],
  standalone: true
})
export class BookInventoryComponent implements OnInit {
  books: Book[] = [];

  constructor(private bookService: BookService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.bookService.books$.subscribe((books: any) => {
      this.books = books;
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddEditBookDialogComponent, {
      width: '400px',
      data: { isEdit: false },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.bookService.addBook(result);
      }
    });
  }

  openEditDialog(book: Book): void {
    const dialogRef = this.dialog.open(AddEditBookDialogComponent, {
      width: '400px',
      data: { isEdit: true, book },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.bookService.editBook(result);
      }
    });
  }

  deleteBook(bookId: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.bookService.deleteBook(bookId);
      }
    });
  }
  openBorrowingsModal(bookId: string): void {
    const dialogRef = this.dialog.open(BorrowingsModalComponent, {
      width: '800px',
      data:{
        bookId:bookId,
        userId:null
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        console.log('Borrowings modal result:', confirmed);
      }
    });
  }
}
