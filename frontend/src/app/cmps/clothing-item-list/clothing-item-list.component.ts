import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { ClothingItem } from '../../models/clothingitem.model';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { Observable, Subject, retry, take, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'clothing-item-list',
  templateUrl: './clothing-item-list.component.html',
  styleUrl: './clothing-item-list.component.scss'
})
export class ClothingItemListComponent  {

  @Output() addToCart = new EventEmitter<ClothingItem>()
  @Output() remove = new EventEmitter<string>()
  @Output() wishlist = new EventEmitter<ClothingItem>()

  @Input() clothes!: ClothingItem[] | null
  @Input() user!: User | null
  
  disconnectedUserClicked: boolean = false
  destroySubject$ = new Subject()
  
  trackByFn(idx: number, item: ClothingItem) : string {
    return item._id
  }

}
