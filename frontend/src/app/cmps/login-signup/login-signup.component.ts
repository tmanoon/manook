import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { Subject, take, takeUntil } from 'rxjs';

@Component({
  selector: 'login-signup',
  templateUrl: './login-signup.component.html',
  styleUrl: './login-signup.component.scss'
})
export class LoginSignupComponent implements OnInit, OnDestroy {

  private userService = inject(UserService)
  private destroySubject$ = new Subject()

  loggedInUser: User | null = null
  sectionClicked: string = 'none'
  disconnectedUserClicked: boolean = false
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
  }


  onUserClick(): void {
    this.sectionClicked = 'user'
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

  onWishlistClick() {
    if (!this.loggedInUser) this.showDisconnectedUserPopUp()
    else this.sectionClicked = 'wishlist'
  }

  showDisconnectedUserPopUp(): void {
    this.disconnectedUserClicked = true
    this.sectionClicked = 'disconnected'
    setTimeout(() => {
      this.disconnectedUserClicked = false
      this.sectionClicked = 'none'
    }, 1500)
  }

  closeMsg(state: boolean): void {
        this.sectionClicked = 'none'
    this.disconnectedUserClicked = state
  }

  onRemoveItemFromWishlist(id: string) {
    if(this.loggedInUser!.wishlist.find(item => item._id === id)) return
    this.userService.removeItemFromWishlist(id)
      .pipe(
        take(1)
      )
      .subscribe({
        error: err => console.log('err', err)
      })
  }

  onCloseModal() {
    this.sectionClicked = 'none'
  }

  ngOnDestroy(): void {
    this.destroySubject$.next(null)
    this.destroySubject$.complete()
  }

}
