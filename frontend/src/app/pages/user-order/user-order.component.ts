import { Component, inject } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Subject, retry, take, takeUntil, tap } from 'rxjs';
import { User } from '../../models/user.model';
import { ClothingItem } from '../../models/clothingitem.model';

@Component({
  selector: 'user-order',
  templateUrl: './user-order.component.html',
  styleUrl: './user-order.component.scss'
})
export class UserOrderComponent {

  private userService = inject(UserService)
  loggedInUser!: User
  destroySubject$ = new Subject()

  ngOnInit(): void {
    this.userService.loggedInUser$
      .pipe(
        takeUntil(this.destroySubject$),
        retry(1),
        tap(user => {
          this.loggedInUser = user!
        })
      )
      .subscribe({
        error: err => console.log('err', err)
      })
  }

  onRemoveItemFromOrder(item: ClothingItem) {
    this.userService.removeItemFromList(item, 'recentOrder')
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


