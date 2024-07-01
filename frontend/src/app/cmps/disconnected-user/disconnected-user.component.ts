import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'disconnected-user',
  templateUrl: './disconnected-user.component.html',
  styleUrl: './disconnected-user.component.scss'
})
export class DisconnectedUserComponent {

  @Output() close = new EventEmitter<boolean>()

  onCloseMsg() : void {
    this.close.emit(false)
  }

}
