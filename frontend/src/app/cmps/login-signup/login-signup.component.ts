import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { userService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'login-signup',
  templateUrl: './login-signup.component.html',
  styleUrl: './login-signup.component.scss'
})
export class LoginSignupComponent implements OnInit, OnDestroy {

  private userService = inject(userService)
  private destroySubject$ = new Subject()

  loggedInUser: User | null = null
  userClickAndState = {
    isClicked: false,
    isUserLoggedIn: false
  }
  user: Partial<User> = { username: '', password: '' }

  guestAcc: Partial<User> = {
    username: 'guest',
    password: 'shov99',
  }

  ngOnInit(): void {
    this.userService.loggedInUser$
      .pipe(takeUntil(this.destroySubject$))
      .subscribe(user => {
        this.loggedInUser = user
      })
    this.userClickAndState.isUserLoggedIn = !!this.loggedInUser
  }

  ngOnDestroy(): void {
    this.destroySubject$.next(null)
    this.destroySubject$.complete()
  }

  onUserClick() {
    this.userClickAndState.isClicked = !this.userClickAndState.isClicked
  }

  onLogin() {
    this.userService.login(this.user)
      .subscribe({
        error: err => console.log('err', err)
      }
      )
  }

  onLogout() {
    this.userService.disconnect()
  }

  onGuestClick() {
    this.userService.login(this.guestAcc)
      .subscribe({
        error: err => console.log('err', err)
      }
      )
  }

}
