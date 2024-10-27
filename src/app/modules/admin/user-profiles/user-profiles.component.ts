import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../../../shared/services/user.service';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { UserEditDialogComponent } from '../../../shared/components/user-edit-dialog/user-edit-dialog.component';

@Component({
  selector: 'app-user-profiles',
  standalone: true,
  imports: [],
  templateUrl: './user-profiles.component.html',
  styleUrl: './user-profiles.component.scss'
})
export class UserProfilesComponent {
  users: any[] = [];

  constructor(private userService: UserService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.userService.users$.subscribe((users: any[]) => {
      console.log('Received users:', users);
      this.users = users;
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(UserEditDialogComponent, {
      width: '400px',
      data: { isEdit: false },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userService.addUser(result);
      }
    });
  }

  openEditDialog(user: any): void {
    const dialogRef = this.dialog.open(UserEditDialogComponent, {
      width: '400px',
      data: { isEdit: true, user },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userService.editUser(result);
      }
    });
  }

  deleteUser(userId: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.userService.deleteUser(userId);
      }
    });
  }

  trackById(index: number, user: any): string {
    return user.id;
  }
}