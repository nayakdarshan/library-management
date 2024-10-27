import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LoaderOverlayService } from '../../../shared/services/loader-overlay.service';
import { CommonServiceService } from '../../../shared/services/common-service.service';
import { IndexedDbService } from '../../../shared/services/indexed-db.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule,
    MatFormFieldModule
  ],
  standalone: true,
})
export class RegisterComponent {
  registerForm!: FormGroup;
  inputTypeForPassword = 'password';
  inputTypeForConfirmPassword = 'password';

  constructor(
    private router: Router, 
    private fb: FormBuilder,
    private loader: LoaderOverlayService,
    public commonService: CommonServiceService,
    private indexedDbService: IndexedDbService
  ) {
    this.buildForm();
  }

  ngonInit() {
    this.buildForm();
  }

  buildForm() {
    this.registerForm = this.fb.group({
      username: ['', Validators.compose([Validators.required])], 
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required])],
      confirmPassword: ['', Validators.compose([Validators.required])],
      role: ['user', Validators.compose([Validators.required])],
    });
  }

  checkForm(formControl: any) {
    return this.registerForm.controls[formControl];
  }

  passwordsMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  async register(formData: any) {
    if (formData.invalid) {
      this.commonService.displayFailureSnackBar('Please correct the errors in the form');
      return;
    }

    const { username, password, email, role } = formData.value;
    const userExists = await this.indexedDbService.getUserByUsername(username);

    if (userExists) {
      this.commonService.displayFailureSnackBar('Username already exists');
    } else {
      const userId = Date.now().toString();
      await this.indexedDbService.addUser({ id: userId, username, password, role, email, borrowingLimit: 5 });
      this.commonService.displaySuccessSnackBar('Registration successful');
      this.router.navigate(['/login']);
    }
  }

  togglePasswordVisibility() {
    this.inputTypeForPassword = this.inputTypeForPassword === 'password' ? 'text' : 'password';
  }

  toggleConfirmPasswordVisibility() {
    this.inputTypeForConfirmPassword = this.inputTypeForConfirmPassword === 'password' ? 'text' : 'password';
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  get f() {
    return this.registerForm.controls;
  }
}
