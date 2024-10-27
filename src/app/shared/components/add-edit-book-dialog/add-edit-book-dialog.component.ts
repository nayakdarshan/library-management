import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonServiceService } from '../../../shared/services/common-service.service';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-book-dialog',
  templateUrl: './add-edit-book-dialog.component.html',
  styleUrls: ['./add-edit-book-dialog.component.scss'],
  imports:[
    ReactiveFormsModule
  ],
  standalone: true
})
export class AddEditBookDialogComponent {
  bookForm!: FormGroup;
  inputTypeForPassword = 'password';

  constructor(
    public dialogRef: MatDialogRef<AddEditBookDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private commonService: CommonServiceService
  ) {
    this.buildForm();
  }

  buildForm() {
    this.bookForm = this.fb.group({
      title: [this.data.book?.title || '', Validators.required],
      author: [this.data.book?.author || '', Validators.required],
      imageSrc: [this.data.book?.imageSrc || '', Validators.required],
      availableCopies: [this.data.book?.availableCopies || 1, [Validators.required, Validators.min(1)]],
      id: [this.data.book?.id || null] 
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.bookForm.invalid) {
      this.commonService.displayFailureSnackBar('Please correct the errors in the form');
      return;
    }

    const bookData = {
      ...this.bookForm.value,   
      id: this.data.book?.id || Date.now().toString()
    };

    this.dialogRef.close(bookData);
    this.commonService.displaySuccessSnackBar('Book details saved successfully');
  }

  togglePasswordVisibility() {
    this.inputTypeForPassword = this.inputTypeForPassword === 'password' ? 'text' : 'password';
  }
}
