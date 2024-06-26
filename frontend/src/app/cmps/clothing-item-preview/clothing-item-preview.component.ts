import { Component, Input } from '@angular/core';
import { ClothingItem } from '../../models/clothingitem.model';

@Component({
  selector: 'clothing-item-preview',
  templateUrl: './clothing-item-preview.component.html',
  styleUrl: './clothing-item-preview.component.scss'
})
export class ClothingItemPreviewComponent {

  @Input() clothingItem!: ClothingItem
}
