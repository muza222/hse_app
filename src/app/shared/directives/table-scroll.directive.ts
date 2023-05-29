import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[tableScroll]'
})
export class TableScrollDirective {

  constructor(private el: ElementRef) {
    this.el.nativeElement.style.cursor = 'grab';
  }

  isDown = false;
  startX: any;
  scrollLeft: any;
  @HostListener('mousedown', ['$event']) onMouseDown(e: MouseEvent) {
    this.grabTable(e);
  }
  @HostListener('mousemove', ['$event']) onMouseMove(e: MouseEvent) {
    this.moveTable(e);
  }
  @HostListener('mouseup') onMouseUp() {
    this.dropTable();
  }
  @HostListener('mouseleave') onMouseLeave() {
    this.dropTable();
  }

  private grabTable(e: MouseEvent) {
    const slider = document.querySelector('.table-inner');
    this.isDown = true;
    slider.classList.add('active');
    this.scrollLeft = slider.scrollLeft;
    this.startX = e.pageX - this.scrollLeft;
  }
  private dropTable() {
    const slider = document.querySelector('.table-inner');
    this.isDown = false;
    slider.classList.remove('active');
  }
  private moveTable(e: MouseEvent) {
    if (!this.isDown) {
      return;
    }
    e.preventDefault();
    const slider = document.querySelector('.table-inner');
    const x = e.pageX - this.scrollLeft;
    const walk = (x - this.startX) * 3; // scroll-fast
    slider.scrollLeft = this.scrollLeft - walk;
  }
}
