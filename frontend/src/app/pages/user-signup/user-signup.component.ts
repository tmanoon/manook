import { Component, inject } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'user-signup',
  templateUrl: './user-signup.component.html',
  styleUrl: './user-signup.component.scss'
})
export class UserSignupComponent {

  private userService = inject(UserService)
  private router = inject(Router)

  newUser: Partial<User> = {
    fullName: '',
    username: '',
    gender: undefined,
    password: '',
    email: '',
    isSubscribed: false,
  }

  onSubmitSignup(ev: Event) : void {
    ev.preventDefault()
    this.userService.signup(this.newUser).subscribe()
    this.router.navigateByUrl('/')
  }
}
