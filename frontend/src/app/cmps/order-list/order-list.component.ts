import { Component, Input, OnInit } from '@angular/core';
import { Order } from '../../models/order.model';

@Component({
  selector: 'order-list',
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss'
})
export class OrderListComponent implements OnInit {

  @Input() orders!: Order[]

  ngOnInit(): void {
    this.orders = this.orders.slice(0, 3)
  }

  trackByFn(idx: number, item: Order) : string {
    return item._id
  }
}
