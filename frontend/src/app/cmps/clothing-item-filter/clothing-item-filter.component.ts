import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ClothingItemService } from '../../services/clothingitem.service';
import { Observable, Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { FilterBy } from '../../models/filterby.model';
import { selectedStyleChange } from '../dynamic-style-input/dynamic-style-input.component';

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
  styles: string[] = ['classic', 'hippie', 'casual', 'sporty', 'basics', 'romantic', 'summer', 'streetwear', 'winter',
    'outwear', 'formal', 'workwear', 'luxurious', 'utility', 'eveningwear', 'activewear', 'sleepwear', 'loungewear']
  types: string[] = ['', 'top', 'dress', 'bottoms', 'jacket', 'set', 'sweater', 'shoes']

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

  onSetStyle(ev: selectedStyleChange) {
    if (ev.isChecked) this.filterBy.style.push(ev.chosenStyle)
    else {
      this.filterBy.style = this.filterBy.style.filter(style => style !== ev.chosenStyle)
    }
    this.onSetFilter(ev.chosenStyle)
  }

  onSelectType(ev: Event) {
    const chosenType = (ev.target as HTMLInputElement).value
    this.filterBy.type = chosenType
    this.onSetFilter(chosenType)
  }

  onSetFilter(term: string) {
    this.filterSubject$.next(term)
  }

  trackByTermFn(idx: number, term: string) {
    return term
  }

  onChangeRange(ev: Event) {
    const num = parseInt((ev.target as HTMLInputElement).value)
    this.filterBy.maxPrice = num
    this.onSetFilter(String(num))
  }

  ngOnDestroy(): void {
    this.destroySubject$.next(null)
    this.destroySubject$.complete()
  }
}
