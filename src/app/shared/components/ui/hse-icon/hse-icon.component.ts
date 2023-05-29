import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, Renderer2, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { HseIconService } from '@core/hse-icon/hse-icon.service';

@Component({
  selector: 'hse-icon',
  templateUrl: './hse-icon.component.html',
  styleUrls: ['./hse-icon.component.scss']
})
export class HseIconComponent implements OnInit, OnChanges {

  @Input() name!: string;
  @Output() load: EventEmitter<string> = new EventEmitter();

  constructor(
    private iconService: HseIconService,
    private sanitizer: DomSanitizer,
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['name'] && !changes['name'].isFirstChange()) {
      this.clearElement();
      this.loadIcon();
    }
  }

  ngOnInit() {
    this.loadIcon();
  }

  loadIcon() {
    this.iconService.getIconByName(this.name).subscribe(
      (icon) => {
        const svgWrapper = this.renderer.createElement('div');
        // если даём иконке ripple эффект, то иконку становится не видно
        svgWrapper.style.zIndex = 2;
        svgWrapper.innerHTML = icon;

        this.renderer.addClass(svgWrapper, 'hse-icon');
        this.elementRef.nativeElement.appendChild(svgWrapper);

        this.load.emit(this.name);
      },
      (error) => console.error(error)
    );
  }

  clearElement() {
    const childElements = this.elementRef.nativeElement.childNodes;
    for (const child of childElements) {
      this.renderer.removeChild(this.elementRef.nativeElement, child);
    }
  }
}
