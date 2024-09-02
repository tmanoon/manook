import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import {  Subject,  takeUntil, tap } from 'rxjs';
import { User } from '../../models/user.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Order } from '../../models/order.model';

@Component({
  selector: 'user-details',
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss'
})
export class UserDetailsComponent implements OnInit, OnDestroy{

  private userService = inject(UserService)
  user!: User
  private fb = inject(FormBuilder)
  userForm!: FormGroup
  destroySubject$ = new Subject()
  isEditMode: boolean = false

  constructor() {
    this.userForm = this.fb.group({
      fullName: [''],
      username: [''],
      gender: [''],
      password: [''],
      email: [''],
      isSubscribed: [false],
      orders: [[]]
    })
  }

  ngOnInit(): void {
    this.userService.loggedInUser$
    .pipe(
      takeUntil(this.destroySubject$),
      tap(user => this.user = user!)
    )
    .subscribe({
      next: user => this.userForm.patchValue(user!),
      error: err => console.log('err', err)
    })
  }

  trackByFn(idx: number, item: Order) {
    return item._id
  }

  onModifyUser(action: string) {
    if(action === 'edit') this.isEditMode = true
    else if(action === 'save') {
      const updatedUser = this.userForm.value
      this.userService.updateUser(updatedUser)
      ?.subscribe(
        {
          next: user => {
            this.user = user
            this.isEditMode = false
          },
          error: err => {
            console.log('err', err)
            throw err
          }
        }
      )
    }
    else this.isEditMode = false
  }

  ngOnDestroy(): void {
    this.destroySubject$.next(null)
    this.destroySubject$.complete()
  }

}
