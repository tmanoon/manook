import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { Subject, take, takeUntil } from 'rxjs';
import { ClothingItem } from '../../models/clothingitem.model';

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
    password: 'guest',
  }
  previewWishlist: ClothingItem[] = []
  previewOrder: ClothingItem[] = []

  ngOnInit(): void {
    this.userService.loggedInUser$
      .pipe(takeUntil(this.destroySubject$))
      .subscribe(user => {
        this.loggedInUser = user
        if(user) {
          if(user.wishlist) this.previewWishlist = user.wishlist.slice(0, 4)
          if(user.recentOrder) this.previewOrder = user.recentOrder.selectedItems.slice(0, 4)
        }
      })
  }

  onLogin() {
    this.userService.login(this.user)
      .subscribe({
        error: err => console.log('err', err)
      })
  }

  onLogout() {
    this.userService.disconnect()
  }

  onGuestClick() {
    this.userService.login(this.guestAcc)
      .subscribe({
        error: err => console.log('err', err)
      })
  }

  onActionClick(selectedAction: string, ev: Event) {
    const evType = ev.type
    if (selectedAction === 'user') this.sectionClicked = 'user'
    else {
      if(!this.loggedInUser && evType === 'mouseover') return
      else if (!this.loggedInUser && selectedAction !== 'none') this.showDisconnectedUserPopUp()
      else this.sectionClicked = selectedAction
    }
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

  onRemoveItemFromList(item: ClothingItem, listName: 'wishlist' | 'recentOrder') {
    if (this.loggedInUser!.wishlist.find(item => item._id === item._id)) return
    this.userService.removeItemFromList(item, listName)
      .pipe(
        take(1)
      )
      .subscribe({
        error: err => console.log('err', err)
      })
  }

  onCloseModal() {
    this.sectionClicked = 'none'
    if(this.disconnectedUserClicked) this.closeMsg(false)
  }

  trackByFn(idx: number, item: ClothingItem) {
    return item._id
  }

  ngOnDestroy(): void {
    this.destroySubject$.next(null)
    this.destroySubject$.complete()
  }

}
