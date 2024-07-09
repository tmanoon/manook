import { Component, inject } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'user-signup',
  templateUrl: './user-signup.component.html',
  styleUrl: './user-signup.component.scss'
})
export class UserSignupComponent {

  private userService = inject(UserService)
  private router = inject(Router)
  private fb = inject(FormBuilder)
  signupForm!: FormGroup
  // newUser: Partial<User> = {
  //   fullName: '',
  //   username: '',
  //   gender: undefined,
  //   password: '',
  //   email: '',
  //   isSubscribed: false,
  // }

  constructor() {
    this.signupForm = this.fb.group({
      fullName: [''],
      username: [''],
      gender: [''],
      password: [''],
      email: [''],
      isSubscribed: [false]
    })
  }

  onSubmitSignup(ev: Event): void {
    ev.preventDefault()
    const userToSave = this.signupForm.value
    this.userService.signup(userToSave).subscribe({
      next: () => this.router.navigateByUrl('/'),
      error: err => console.log('err', err)
    })
    // this.router.navigateByUrl('/')
  }
}
