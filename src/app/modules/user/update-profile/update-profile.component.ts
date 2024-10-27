import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';
import { CommonServiceService } from '../../../shared/services/common-service.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-update-profile',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.scss']
})
export class UpdateProfileComponent implements OnInit {
  userForm: FormGroup;
  currentUser: any;
  userId: string;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private commonService: CommonServiceService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.userForm = this.formBuilder.group({
      username: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        zipCode: ['']
      })
    });

    if (isPlatformBrowser(this.platformId)) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser') ?? '{}');
      this.userId = this.currentUser.id;
    } else {
      this.currentUser = {};
      this.userId = '';
    }
  }

  ngOnInit(): void {
    if (this.userId) {
      this.loadUserData(this.userId);
    } else {
      this.commonService.displayFailureSnackBar('No user found in local storage.');
    }
  }

  async loadUserData(userId: string) {
    try {
      const user = await this.userService.getUserById(userId);
      if (user) {
        this.userForm.patchValue(user);
      } else {
        this.commonService.displayFailureSnackBar('User not found!');
      }
    } catch (error) {
      this.commonService.displayFailureSnackBar('Error loading user data: ' + error);
    }
  }

  async onSubmit() {
    if (this.userForm.valid) {
      const updatedUser = { ...this.userForm.value, id: this.userId };
      const success = await this.userService.editUser(updatedUser);
      if (success) {
        this.commonService.displaySuccessSnackBar('User updated successfully!');
        this.router.navigate(['/user/update-profile']);
      } else {
        this.commonService.displayFailureSnackBar('Failed to update user.');
      }
    } else {
      this.commonService.displayFailureSnackBar('Please fill in all required fields.');
    }
  }
}
