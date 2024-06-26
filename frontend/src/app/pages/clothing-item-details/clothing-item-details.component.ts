import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClothingItem } from '../../models/clothingitem.model';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'clothing-item-details',
  templateUrl: './clothing-item-details.component.html',
  styleUrl: './clothing-item-details.component.scss'
})

export class ClothingItemDetailsComponent {
  private route = inject(ActivatedRoute)
  private router = inject(Router)

  clothingItem$: Observable<ClothingItem> = this.route.data.pipe(
    map(data => {
      console.log(data)
      const clothingItem: ClothingItem = data['clothingItem']
      return clothingItem
    }))

    onBack() {
      this.router.navigateByUrl('/clothing-item')
  }
}
