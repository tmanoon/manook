import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FilterBy } from '../../models/filterby.model';

export type selectedStyleChange = {
  isChecked: boolean, 
  chosenStyle: string
}
@Component({
  selector: 'dynamic-style-input',
  templateUrl: './dynamic-style-input.component.html',
  styleUrl: './dynamic-style-input.component.scss'
})

export class DynamicStyleInputComponent {

  @Input() filterBy!: FilterBy
  @Input() style!: string
  @Output() select = new EventEmitter<selectedStyleChange>()

  onSetStyle(e: Event) {
    const ev = e.target as HTMLInputElement
    const selection: selectedStyleChange = {
      isChecked: ev.checked,
      chosenStyle: ev.value
    }
    this.select.emit(selection)
  }
}
