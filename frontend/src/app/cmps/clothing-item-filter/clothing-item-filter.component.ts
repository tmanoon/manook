import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ClothingItemService } from '../../services/clothingitem.service';
import { Observable, Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { FilterBy } from '../../models/filterby.model';

@Component({
  selector: 'clothing-item-filter',
  templateUrl: './clothing-item-filter.component.html',
  styleUrl: './clothing-item-filter.component.scss'
})
export class ClothingItemFilterComponent implements OnInit, OnDestroy {
  private clothingItemService = inject(ClothingItemService)
  private filterSubject$ = new Subject()
  private destroySubject$ = new Subject()
  public filterBy!: FilterBy

  ngOnInit(): void {

    this.clothingItemService.filterBy$
      .pipe(
        takeUntil(this.destroySubject$)
      )
      .subscribe({
        next: filterBy => this.filterBy = filterBy,
        error: err => console.log('err', err)
      })

    this.filterSubject$
      .pipe(
        debounceTime(200),
        takeUntil(this.destroySubject$)
      )
      .subscribe(() =>
        this.clothingItemService.setFilter(this.filterBy)
      )
  }

  onSetStyle(e: Event) {
    const chosenStyle: string = (e.target as HTMLInputElement).value
    const isChecked: boolean = (e.target as HTMLInputElement).checked
    console.log(chosenStyle, isChecked)
    if (isChecked) this.filterBy.style.push(chosenStyle)
    else {
      this.filterBy.style = this.filterBy.style.filter(style => style !== chosenStyle)
    }
    this.onSetFilter(chosenStyle)
  }

  onSetFilter(term: string) {
    this.filterSubject$.next(term)
  }

  ngOnDestroy(): void {
    this.destroySubject$.next(null)
    this.destroySubject$.complete()
  }
}
