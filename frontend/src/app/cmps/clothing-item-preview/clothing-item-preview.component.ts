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

  @Output() itemToAdd = new EventEmitter<ClothingItem>()

  onAddItemToCart(item: ClothingItem) : void {
    this.itemToAdd.emit(item)
  }

}
