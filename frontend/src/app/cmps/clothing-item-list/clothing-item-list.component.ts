import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { ClothingItem } from '../../models/clothingitem.model';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { Observable, Subject, retry, takeUntil } from 'rxjs';

@Component({
  selector: 'clothing-item-list',
  templateUrl: './clothing-item-list.component.html',
  styleUrl: './clothing-item-list.component.scss'
})
export class ClothingItemListComponent implements OnInit, OnDestroy {
  
  @Input() clothes!: ClothingItem[] | null
  private userService = inject(UserService)
  disconnectedUserClicked: boolean = false
  destroySubject$ = new Subject()
  user!: User | null

  ngOnInit(): void {
    this.userService.loggedInUser$
      .pipe(
        takeUntil(this.destroySubject$),
        retry(1)
      )
      .subscribe(user => this.user = user)
  }

  onAddClothingItem(item: ClothingItem): void {
    this.disconnectedUserClicked = this.userService.addItemToOrder(item)
    if(this.disconnectedUserClicked) this.showDisconnectedUserPopUp
  }

  showDisconnectedUserPopUp(): void {
    this.disconnectedUserClicked = true
    setTimeout(() => {
      !this.disconnectedUserClicked
    }, 1500)
  }

  ngOnDestroy(): void {
    this.destroySubject$.next(null)
    this.destroySubject$.complete()
  }

  trackByFn(idx: number, item: ClothingItem) : string {
    return item._id
  }
  
}
