import { Component, Input } from '@angular/core';
import { ClothingItem } from '../../models/clothingitem.model';

@Component({
  selector: 'clothing-item-list',
  templateUrl: './clothing-item-list.component.html',
  styleUrl: './clothing-item-list.component.scss'
})
export class ClothingItemListComponent {

  @Input() clothes!: ClothingItem[] 
}
