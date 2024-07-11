import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Observable, Subject, Subscription, retry, take, takeUntil, tap } from 'rxjs';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'order-payment',
  templateUrl: './order-payment.component.html',
  styleUrl: './order-payment.component.scss'
})
export class OrderPaymentComponent implements OnInit, OnDestroy {

  private userService = inject(UserService)
  private router = inject(Router)
  private fb = inject(FormBuilder)
  paymentForm!: FormGroup
  subscription!: Subscription
  user!: User

  constructor() {
    this.paymentForm = this.fb.group({
      fullName: [''],
      email: [''],
      address: [''],
      phone: ['']
    })
  }

  ngOnInit(): void {
    this.subscription = this.userService.loggedInUser$.subscribe({
      next: user => {
        this.paymentForm.patchValue(user!)
        this.user = user!
      },
      error: err => console.log('err', err)
    })
  }

  onCompletePayment() {
    this.userService.addOrder(this.paymentForm.value)
    .pipe(
      take(1)
    )
    .subscribe({
      next: () => this.router.navigateByUrl('/'),
      error: err => console.log('err', err)
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

}
