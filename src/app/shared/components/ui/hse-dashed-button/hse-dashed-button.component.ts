import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'hse-dashed-button',
  templateUrl: './hse-dashed-button.component.html',
  styleUrls: ['./hse-dashed-button.component.scss']
})
export class HseDashedButtonComponent {
  /**
   * Размер кнопки
   * Допустимые значения: 'big', 'small'
   * Default: 'big'
   */
  @Input() size: string;

  /**
   * Ширина кнопки
   */
  @Input() width: string;

  /**
   * Занимать пространство родительского контейнера
   */
  @Input() fillSize = false;

  /**
   * Флаг активности кнопки
   */
  @Input() disabled: boolean;

  @Output() callback: EventEmitter<any> = new EventEmitter<any>();

  clickHandle() {
    if (this.callback) {
      this.callback.emit();
    }
  }

}
