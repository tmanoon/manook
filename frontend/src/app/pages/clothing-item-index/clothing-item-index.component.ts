import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ClothingItem } from '../../models/clothingitem.model';
import { Observable, Subject, retry, take, takeUntil, tap } from 'rxjs';
import { ClothingItemService } from '../../services/clothingitem.service';


@Component({
  selector: 'clothing-item-index',
  templateUrl: './clothing-item-index.component.html',
  styleUrl: './clothing-item-index.component.scss'
})
export class ClothingItemIndexComponent implements OnInit, OnDestroy {

  private clothingItemService = inject(ClothingItemService)
  private destroySubject$ = new Subject()
  clothes!: ClothingItem[]

  ngOnInit(): void {
    this.clothingItemService.clothes$
      .pipe(
        takeUntil(this.destroySubject$),
        retry(1),
        tap(clothes => this.clothes = clothes)
      )
      .subscribe({
        error: err => {
          console.log('err', err)
          throw err
        }
      })
  }

  ngOnDestroy(): void {
    this.destroySubject$.next(null)
    this.destroySubject$.complete()
  }
}
