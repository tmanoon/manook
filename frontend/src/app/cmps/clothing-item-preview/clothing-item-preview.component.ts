import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { ClothingItem } from '../../models/clothingitem.model';
import { UserService } from '../../services/user.service';
import { Observable, Subject, retry, takeUntil } from 'rxjs';
import { User } from '../../models/user.model';

@Component({
  selector: 'clothing-item-preview',
  templateUrl: './clothing-item-preview.component.html',
  styleUrl: './clothing-item-preview.component.scss'
})
export class ClothingItemPreviewComponent {

  @Input() clothingItem!: ClothingItem
  @Input() user!: User | null

  @Output() addToCart = new EventEmitter<ClothingItem>()
  @Output() remove = new EventEmitter<string>()
  @Output() wishlist = new EventEmitter<ClothingItem>()

  onAddItemToCart(): void {
    this.addToCart.emit(this.clothingItem)
  }

  onRemoveItem() {
    this.remove.emit(this.clothingItem._id)
  }

  onAddItemToWishlist(): void {
    if (this.user && this.user.wishlist.find(item => item._id === this.clothingItem._id)) return
    this.wishlist.emit(this.clothingItem)
  }
}