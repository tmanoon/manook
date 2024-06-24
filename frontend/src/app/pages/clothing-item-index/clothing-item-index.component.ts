import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ClothingItem } from '../../models/clothingitem.model';
import { Observable, Subject, retry, take, takeUntil, tap } from 'rxjs';
import { ClothingItemService } from '../../services/clothingitem.service';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'clothing-item-index',
  templateUrl: './clothing-item-index.component.html',
  styleUrl: './clothing-item-index.component.scss'
})
export class ClothingItemIndexComponent implements OnInit, OnDestroy {

  private clothingItemService = inject(ClothingItemService)
  private userService = inject(UserService)
  private destroySubject$ = new Subject()
  disconnectedUserClicked: boolean = false
  clothes$!: ClothingItem[]
  user$!: User

  ngOnInit(): void {
    this.clothingItemService.clothes$
      .pipe(
        takeUntil(this.destroySubject$),
        take(1),
        retry(1),
        tap(clothes => this.clothes$ = clothes)
      )
      .subscribe({
        error: err => {
          console.log('err', err)
          throw err
        }
      })

    this.userService.loggedInUser$
      .pipe(
        takeUntil(this.destroySubject$),
        take(1),
        retry(1),
        tap(user => {
          if (user) this.user$ = user
        }
        )
      )
      .subscribe({
        error: err => {
          console.log('err', err)
          throw err
        }
      })
  }

  onAddClothingItem(item: ClothingItem) : void {
    if(this.user$) {
      if(this.user$.recentOrder) {
        this.user$.recentOrder.selectedItems.push(item)
        this.user$.recentOrder.sum += item.price
    } else {
      this.user$.recentOrder = {
        buyer: this.user$,
        selectedItems: [item],
        sum: item.price
      }
    }
  } else {
    this.showDisconnectedUserPopUp()
  }
}

showDisconnectedUserPopUp() : void {
  this.disconnectedUserClicked = true
  setTimeout(() => {
    !this.disconnectedUserClicked
  }, 1500)
}

  ngOnDestroy(): void {
    this.destroySubject$.next(null)
    this.destroySubject$.complete()
  }
}
