import { Component, OnInit, inject } from '@angular/core';
import { userService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'login-signup',
  templateUrl: './login-signup.component.html',
  styleUrl: './login-signup.component.scss'
})
export class LoginSignupComponent implements OnInit {

  private userService = inject(userService)

  loggedInUser: User | null = null
  userClickAndState = { 
    isClicked: false,
    isUserLoggedIn: false
  }

  ngOnInit(): void {
    this.userService.loggedInUser$
      .subscribe(user => {
        this.loggedInUser = user
      })
    this.userClickAndState.isUserLoggedIn = !!this.loggedInUser
  }

  onUserClick() {
    this.userClickAndState.isClicked = !this.userClickAndState.isClicked
  }


}
