import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { Observable, Subject, retry, take, takeUntil, tap } from 'rxjs';
import { ClothingItem } from '../../models/clothingitem.model';

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

  onRemoveItemFromWishlist(item: ClothingItem) {
    if (!this.user.wishlist.find(item => item._id === item._id)) return
    this.userService.removeItemFromList(item, 'wishlist')
      .pipe(
        take(1)
      )
      .subscribe({
        error: err => console.log('err', err)
      })
  }

  onAddItemToCart(item: ClothingItem) {
    this.userService.addItemToList(item, 'recentOrder')
    .pipe(
      take(1),
      retry(1)
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
