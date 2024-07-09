import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClothingItem } from '../../models/clothingitem.model';
import { Observable, map, tap } from 'rxjs';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'clothing-item-details',
  templateUrl: './clothing-item-details.component.html',
  styleUrl: './clothing-item-details.component.scss'
})

export class ClothingItemDetailsComponent {
  private route = inject(ActivatedRoute)
  private router = inject(Router)
  private userService = inject(UserService)
  loggedInUser$: Observable<User | null> = this.userService.loggedInUser$
  clothingItem$: Observable<ClothingItem> = this.route.data.pipe(
    map(data => {
      const clothingItem: ClothingItem = data['clothingItem']
      return clothingItem
    }))

    onAddItemToList(listName: 'wishlist' | 'recentOrder') {
      this.clothingItem$.pipe(
        tap(item => {
          this.userService.addItemToList(item, listName)
          .subscribe()
        })
      )
      .subscribe({
        error: err => console.log('err', err)
      })
    }

    onBack() {
      this.router.navigateByUrl('/clothing-item')
  }
}
