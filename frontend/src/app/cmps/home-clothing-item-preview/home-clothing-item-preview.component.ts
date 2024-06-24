import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ClothingItemService } from '../../services/clothingitem.service';
import { Observable, Subject, filter, map, take, takeUntil, tap } from 'rxjs';
import { ClothingItem } from '../../models/clothingitem.model';

@Component({
  selector: 'home-clothing-item-preview',
  templateUrl: './home-clothing-item-preview.component.html',
  styleUrl: './home-clothing-item-preview.component.scss'
})
export class HomeClothingItemPreviewComponent {


  private clothingItemService = inject(ClothingItemService)
  clothes$: Observable<ClothingItem[]> = this.clothingItemService.clothes$
      .pipe(
        map(clothes => clothes.slice(0, 3))
      )

      constructor() {}

}
