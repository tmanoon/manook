import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { Observable, Subject, retry, take, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'user-wishlist',
  templateUrl: './user-wishlist.component.html',
  styleUrl: './user-wishlist.component.scss'
})
export class UserWishlistComponent implements OnInit, OnDestroy {

  private userService = inject(UserService)
  private destroySubject$ = new Subject()
  user!: User

  ngOnInit(): void {
    this.userService.loggedInUser$
      .pipe(
        retry(1),
        takeUntil(this.destroySubject$),
        tap(user => {
          this.user = user!
        })
      )
      .subscribe({
        error: err => console.log('err', err)
      })
  }

  onRemoveItemFromWishlist(id: string) {
    if (this.user!.wishlist.find(item => item._id === id)) return
    this.userService.removeItemFromWishlist(id)
      .pipe(
        take(1)
      )
      .subscribe({
        error: err => console.log('err', err)
      })
  }

  ngOnDestroy(): void {
    this.destroySubject$.next(null)
    this.destroySubject$.complete()
  }
}
