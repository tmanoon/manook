import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Observable, Subject, retry, take, takeUntil, tap } from 'rxjs';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'order-payment',
  templateUrl: './order-payment.component.html',
  styleUrl: './order-payment.component.scss'
})
export class OrderPaymentComponent {


}
