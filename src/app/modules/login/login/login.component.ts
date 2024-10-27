import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonServiceService } from '../../../shared/services/common-service.service';
import { IndexedDbService } from '../../../shared/services/indexed-db.service';
import { LoaderOverlayService } from '../../../shared/services/loader-overlay.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  standalone: true,
})
export class LoginComponent {
  inputType = 'password';
  loginForm!: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private commonService: CommonServiceService,
    private indexedDbService: IndexedDbService,
    private loader: LoaderOverlayService,
  ) {
    this.buildForm();
  }

  buildForm() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  async login(formData: any) {
    this.loader.showLoader();
    const { username, password } = formData;
    const user = await this.indexedDbService.getUserByUsername(username);

    if (user && user.password === password) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      let isAdmin = user.role === 'admin' ? true : false ;
      console.log('isAdmin', isAdmin);
      localStorage.setItem('isAdmin', JSON.stringify(isAdmin));
      if (isAdmin){
        this.router.navigate(['/admin']).then(() => this.loader.hideLoader());
      }else{
        this.router.navigate(['/user']).then(() => this.loader.hideLoader());
      }
      this.commonService.displaySuccessSnackBar('Login successful');
    } else {
      this.loader.hideLoader();
      this.commonService.displayFailureSnackBar('Invalid credentials');
    }
  }

  togglePasswordVisibility() {
    this.inputType = this.inputType === 'password' ? 'text' : 'password';
  }

  goToSignUp() {
    this.router.navigate(['/register']);
  }
}
