import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BookService } from '../../../shared/services/book.service';
import { ConfirmationPopupComponent } from '../../../shared/components/confirmation-popup/confirmation-popup.component';
import { CommonServiceService } from '../../../shared/services/common-service.service';

@Component({
  selector: 'app-borrow-books',
  standalone: true,
  imports: [],
  templateUrl: './borrow-books.component.html',
  styleUrls: ['./borrow-books.component.scss']
})
export class BorrowBooksComponent implements OnInit {
  books: any[] = [];
  currentUser: any = JSON.parse(localStorage.getItem('currentUser') ?? '{}');
  userId = this.currentUser.id;

  constructor(
    private bookService: BookService, 
    public dialog: MatDialog,
    private commonService: CommonServiceService
  ) {}

  ngOnInit(): void {
    this.loadAvailableBooks();
  }

  async loadAvailableBooks() {
    this.books = await this.bookService.getAvailableBooksForUser(this.userId);
  }

  borrowBook(book: any): void {
    if (book.availableCopies > 0) {
      const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
        width: '300px',
        data: { message: `Are you sure you want to borrow "${book.title}"?` }
      });

      dialogRef.afterClosed().subscribe(async (confirmed) => {
        if (confirmed) {
          await this.bookService.borrowBook(this.userId, book.id);
          this.loadAvailableBooks();
          this.commonService.displaySuccessSnackBar('Book borrowed successfully');
        }
      });
    } else {
      this.commonService.displayFailureSnackBar('No copies available for this book.');
    }
  }
}
