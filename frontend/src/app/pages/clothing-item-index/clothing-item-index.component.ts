import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ClothingItem } from '../../models/clothingitem.model';
import { Observable, Subject, retry, take, takeUntil, tap } from 'rxjs';
import { ClothingItemService } from '../../services/clothingitem.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';


@Component({
  selector: 'clothing-item-index',
  templateUrl: './clothing-item-index.component.html',
  styleUrl: './clothing-item-index.component.scss'
})
export class ClothingItemIndexComponent implements OnInit, OnDestroy {

  private clothingItemService = inject(ClothingItemService)
  private userService = inject(UserService)
  private destroySubject$ = new Subject()
  clothes!: ClothingItem[]
  user! : User | null
  disconnectedUserClicked: boolean = false

  ngOnInit(): void {
    this.clothingItemService.clothes$
      .pipe(
        takeUntil(this.destroySubject$),
        retry(1),
        tap(clothes => this.clothes = clothes)
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
          retry(1),
          tap(user => this.user = user
          )
        )
        .subscribe({
          error: err => console.log('err', err)
        })
  }

  onRemoveClothingItem(id: string) {
    this.clothingItemService.deleteClothingItem(id)
      .pipe(
        take(1)
      )
      .subscribe({
        error: err => console.log('err', err)
      })
  }

  OnAddItemToCart(item: ClothingItem) : void {
    if(!this.user) this.showDisconnectedUserPopUp()
    this.userService.addItemToOrder(item)
    .subscribe({
      error: err => console.log('err', err)
    })
  }

  showDisconnectedUserPopUp(): void {
    this.disconnectedUserClicked = true
    setTimeout(() => {
      this.disconnectedUserClicked = !this.disconnectedUserClicked
    }, 1500)
  }

  onCloseMsg() : void {
    this.disconnectedUserClicked = false
  }

  ngOnDestroy(): void {
    this.destroySubject$.next(null)
    this.destroySubject$.complete()
  }
}
