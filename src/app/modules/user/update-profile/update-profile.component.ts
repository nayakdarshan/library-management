import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';
import { CommonServiceService } from '../../../shared/services/common-service.service';

@Component({
  selector: 'app-update-profile',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './update-profile.component.html',
  styleUrl: './update-profile.component.scss'
})
export class UpdateProfileComponent {
  userForm: FormGroup;
  currentUser: any = JSON.parse(localStorage.getItem('currentUser') ?? '{}');
  userId = this.currentUser.id;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private commonService: CommonServiceService
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
  }

  ngOnInit(): void {
    this.loadUserData(this.userId);
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
    }
  }
}
