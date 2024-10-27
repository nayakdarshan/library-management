import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonServiceService } from '../../../shared/services/common-service.service';
import { IndexedDbService } from '../../../shared/services/indexed-db.service';
import { LoaderOverlayService } from '../../../shared/services/loader-overlay.service';
import { isPlatformBrowser } from '@angular/common';

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
    @Inject(PLATFORM_ID) private platformId: Object 
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
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        const isAdmin = user.role === 'admin';
        console.log('isAdmin', isAdmin);
        localStorage.setItem('isAdmin', JSON.stringify(isAdmin));
        this.router.navigate([isAdmin ? '/admin' : '/user']).then(() => this.loader.hideLoader());
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
