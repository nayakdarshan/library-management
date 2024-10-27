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
  styleUrls: ['./your-borrowings.component.scss']
})
export class YourBorrowingsComponent implements OnInit {
  books: any[] = [];
  currentUser: any = {};
  userId: string | undefined;

  constructor(
    private bookService: BookService, 
    public dialog: MatDialog,
    private router: Router,
    private commonService: CommonServiceService
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadAvailableBooks();
  }

  loadCurrentUser(): void {
    if (typeof localStorage !== 'undefined') {
      const user = localStorage.getItem('currentUser');
      if (user) {
        this.currentUser = JSON.parse(user);
        this.userId = this.currentUser.id;
      }
    }
  }

  async loadAvailableBooks() {
    if (this.userId) {
      this.books = await this.bookService.getBorrowedBooksByUser(this.userId);
    }
  }

  returnBorrowedBook(book: any): void {
    const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
      width: '300px',
      data: { message: `Are you sure you want to return "${book.title}"?` }
    });

    dialogRef.afterClosed().subscribe(async (confirmed) => {
      if (confirmed && this.userId) {
        await this.bookService.returnBook(this.userId, book.id);
        this.loadAvailableBooks();
        this.commonService.displaySuccessSnackBar('Book returned successfully');
      }
    });
  }

  navigateToBorrowBooks(): void {
    this.router.navigate(['user/borrow-book']);
  }
}
