import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BookService } from '../../../shared/services/book.service';
import { ConfirmationPopupComponent } from '../../../shared/components/confirmation-popup/confirmation-popup.component';
import { CommonServiceService } from '../../../shared/services/common-service.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-borrow-books',
  standalone: true,
  imports: [],
  templateUrl: './borrow-books.component.html',
  styleUrls: ['./borrow-books.component.scss']
})
export class BorrowBooksComponent implements OnInit {
  books: any[] = [];
  currentUser: any = {};
  userId: any = null;

  constructor(
    private bookService: BookService,
    public dialog: MatDialog,
    private commonService: CommonServiceService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadAvailableBooks();
  }

  private loadCurrentUser(): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser') ?? '{}');
        this.userId = this.currentUser.id || null;
      } catch (error) {
        console.error('Could not access localStorage', error);
        this.currentUser = {};
      }
    }
  }

  async loadAvailableBooks() {
    if (this.userId) {
      this.books = await this.bookService.getAvailableBooksForUser(this.userId);
    } else {
      this.commonService.displayFailureSnackBar('User not found. Please log in.');
    }
  }

  borrowBook(book: any): void {
    if (book.availableCopies > 0) {
      const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
        width: '500px',
        data: { 
          message: `Are you sure you want to borrow "${book.title}"?`,
          type: 'borrow' 
        }
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
