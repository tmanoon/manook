import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ClothingItemService } from '../../services/clothingitem.service';
import { FilterBy } from '../../models/filterby.model';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.scss'
})
export class AppHeaderComponent implements OnInit, OnDestroy {

  private clothingItemService = inject(ClothingItemService)
  private filterSubject$ = new Subject()
  private destroySubject$ = new Subject()
  public discount = {isDiscount: true, sumOfDiscount: 40}
  public filterBy!: FilterBy

  ngOnInit(): void {
    this.clothingItemService.filterBy$
      .pipe(takeUntil(this.destroySubject$))
      .subscribe(filterBy => {
        this.filterBy = filterBy
      })

      this.filterSubject$
        .pipe(
          debounceTime(500),
          distinctUntilChanged(),
          takeUntil(this.destroySubject$)
        )
        .subscribe(() =>
          this.clothingItemService.setFilter(this.filterBy)
        )
  }

  onSetFilter(term: string) {
    this.filterSubject$.next(term)
  }

  ngOnDestroy(): void {
    this.destroySubject$.next(null)
    this.destroySubject$.complete()
  }



}
