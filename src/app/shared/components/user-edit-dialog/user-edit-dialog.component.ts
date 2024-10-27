import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-user-edit-dialog',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './user-edit-dialog.component.html',
  styleUrl: './user-edit-dialog.component.scss'
})
export class UserEditDialogComponent {
  userForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UserEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: any }
  ) {
    this.userForm = this.fb.group({
      name: [data.user?.name, Validators.required],
      email: [data.user?.email, [Validators.required, Validators.email]],
      phone: [data.user?.phone, Validators.required],
      borrowingLimit: [data.user?.borrowingLimit, [Validators.required, Validators.min(1)]],
      street: [data.user?.address?.street, Validators.required],
      city: [data.user?.address?.city, Validators.required],
      state: [data.user?.address?.state, Validators.required],
      zipCode: [data.user?.address?.zipCode, [Validators.required]],
    });
  }

  onSave(): void {
    if (this.userForm.valid) {
      const updatedUser: any = { 
        ...this.data.user, 
        ...this.userForm.value,
        address: {
          street: this.userForm.value.street,
          city: this.userForm.value.city,
          state: this.userForm.value.state,
          zipCode: this.userForm.value.zipCode,
        }
      };
      this.dialogRef.close(updatedUser);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
