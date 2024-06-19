import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ClothingItemService } from '../../services/clothingitem.service';
import { Subject, map, take, takeUntil } from 'rxjs';
import { ClothingItem } from '../../models/clothingitem.model';

@Component({
  selector: 'home-clothing-item-preview',
  templateUrl: './home-clothing-item-preview.component.html',
  styleUrl: './home-clothing-item-preview.component.scss'
})
export class HomeClothingItemPreviewComponent implements OnInit, OnDestroy{

  private clothingItemService = inject(ClothingItemService)
  private destroySubject$ = new Subject()

  clothes!: ClothingItem[]


  ngOnInit(): void {
    this.clothingItemService.clothes$
      .pipe(
        take(4),
        takeUntil(this.destroySubject$)
      )
      .subscribe(clothes => {
        this.clothes = clothes
      })
  }

  ngOnDestroy(): void {
    this.destroySubject$.next(null)
    this.destroySubject$.complete()
  }


}
