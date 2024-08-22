import { Component, Input, OnInit } from '@angular/core';
import { Order } from '../../models/order.model';
import { ClothingItem } from '../../models/clothingitem.model';

@Component({
  selector: 'order-preview',
  templateUrl: './order-preview.component.html',
  styleUrl: './order-preview.component.scss'
})
export class OrderPreviewComponent implements OnInit {
  @Input() order!: Order
 
  ngOnInit(): void {
    this.order.selectedItems.slice(0, 4)
  }
 
  trackByFn(idx: number, item: ClothingItem) {
    return item._id
  }
}
