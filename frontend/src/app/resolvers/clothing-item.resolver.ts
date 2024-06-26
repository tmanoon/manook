import { ResolveFn } from '@angular/router';
import { ClothingItem } from '../models/clothingitem.model';
import { inject } from '@angular/core';
import { ClothingItemService } from '../services/clothingitem.service';
import { delay } from 'rxjs';

export const clothingItemResolver: ResolveFn<ClothingItem> = (route, state) => {
  const clothingItemService = inject(ClothingItemService)
  const id = route.params['id']
  return clothingItemService.getClothingItemById(id)
    .pipe(delay(500)
  )
};
