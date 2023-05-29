import { AfterContentInit, Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[hseAutoHeight]'
})
export class AutoHeightDirective implements AfterContentInit {

  constructor(private element: ElementRef, private renderer: Renderer2) {
  }

  ngAfterContentInit() {
    const contentWrapper: HTMLTextAreaElement = this.renderer.createElement('textarea');
    this.element.nativeElement.parentNode.appendChild(contentWrapper);
    this.element.nativeElement.parentNode.style.position = 'relative';
    const targetStyles = getComputedStyle(this.element.nativeElement);
    contentWrapper.style.fontSize = targetStyles.fontSize;
    contentWrapper.style.padding = targetStyles.padding;
    contentWrapper.style.boxSizing = targetStyles.boxSizing;
    contentWrapper.style.width = targetStyles.width;
    contentWrapper.style.height = 'auto';
    contentWrapper.style.position = 'absolute';
    contentWrapper.style.visibility = 'hidden';

    const calculateHeight = () => {
      setTimeout(() => {
        contentWrapper.value = this.element.nativeElement.value;
        this.element.nativeElement.style.height = `${contentWrapper.scrollHeight}px`;
        if (contentWrapper.scrollHeight < parseInt(targetStyles.maxHeight, 10)) {
          this.element.nativeElement.classList.add('hide-scrollbar');
        } else {
          this.element.nativeElement.classList.remove('hide-scrollbar');
        }
      });
    };

    calculateHeight();
    this.element.nativeElement.addEventListener('input', () => {
      calculateHeight();
    });
  }
}
