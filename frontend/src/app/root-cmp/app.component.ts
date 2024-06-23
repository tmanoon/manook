import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ClothingItemService } from '../services/clothingitem.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  private clothingItemService = inject(ClothingItemService)
  
  ngOnInit(): void {
    this.clothingItemService.loadClothes()
    .pipe(
      take(1)
    )
    .subscribe({
      error: err => console.log('err', err)
    })
  }
}
