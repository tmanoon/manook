import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { ClothingItem } from '../../models/clothingitem.model';
import { UserService } from '../../services/user.service';
import { Observable, Subject, retry, takeUntil } from 'rxjs';
import { User } from '../../models/user.model';

@Component({
  selector: 'clothing-item-preview',
  templateUrl: './clothing-item-preview.component.html',
  styleUrl: './clothing-item-preview.component.scss'
})
export class ClothingItemPreviewComponent implements OnInit, OnDestroy {

  @Input() clothingItem!: ClothingItem
  private userService = inject(UserService)
  private destroySubject$ = new Subject()
  user: User | null = null

  ngOnInit(): void {
    this.userService.loggedInUser$
      .pipe(
        takeUntil(this.destroySubject$),
        retry(1)
      )
      .subscribe(user => this.user = user)
  }

  ngOnDestroy(): void {
    this.destroySubject$.next(null)
    this.destroySubject$.complete()
  }

}
