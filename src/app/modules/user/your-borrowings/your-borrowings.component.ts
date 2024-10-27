import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BookService } from '../../../shared/services/book.service';
import { ConfirmationPopupComponent } from '../../../shared/components/confirmation-popup/confirmation-popup.component';
import { Router } from '@angular/router';
import { CommonServiceService } from '../../../shared/services/common-service.service';
@Component({
  selector: 'app-your-borrowings',
  standalone: true,
  imports: [],
  templateUrl: './your-borrowings.component.html',
  styleUrl: './your-borrowings.component.scss'
})
export class YourBorrowingsComponent {
  books: any[] = [];
  currentUser:any = JSON.parse(localStorage.getItem('currentUser')?? '{}');
  userId = this.currentUser.id;

  constructor(
    private bookService: BookService, 
    public dialog: MatDialog,
    private router: Router,
    private commonService: CommonServiceService
  ) {}

  ngOnInit(): void {
    this.loadAvailableBooks();
  }

  async loadAvailableBooks() {
    this.books = await this.bookService.getBorrowedBooksByUser(this.userId);
  }

  returnBorrowedBook(book: any): void {
    if (book.availableCopies > 0) {
      const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
        width: '300px',
        data: { message: `Are you sure you want to return "${book.title}"?` }
      });

      dialogRef.afterClosed().subscribe(async(confirmed) => {
        if (confirmed) {
          await this.bookService.returnBook(this.userId, book.id);
          this.loadAvailableBooks();
          this.commonService.displaySuccessSnackBar('Book returned successfully');
        }
      });
    } else {
      this.commonService.displayFailureSnackBar('No copies available for this book.');
    }
  }
  navigateToBorrowBooks(): void {
    this.router.navigate(['user/borrow-book']);
  }
}
