import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { range as _range, map as _map } from 'lodash/fp';


/**
 * Компонент пагинатора
 *
 * totalPages - общее кол-во страниц
 * page - номер выбранной страницы
 * perPage - кол-во элементов на странице
 * pageChange - callback на изменение page
 * perPageVariants - массив вариантов изменения perPage
 * perPageChange - callback на изменение perPage
 * <kit-pagination [totalPages]="10" [page]="2" [perPage]="15">
 */
@Component({
  selector: 'hse-pagination',
  templateUrl: './hse-pagination.component.html',
  styleUrls: ['./hse-pagination.component.scss']
})
export class HsePaginationComponent implements OnInit, OnChanges {

  @Input() totalPages: number;
  @Input() page: number;
  @Input() perPage: number;
  /* tslint:disable:no-magic-numbers */
  @Input() perPageVariants = [15, 30, 45, 60];
  @Output() pageChange = new EventEmitter<number>();
  @Output() perPageChange = new EventEmitter<number>();

  pagesToShow: any = [];
  defaultPerPage = 30;

  perPageData: any = [];
  selectCollection = [
    {
      id: '1',
      name: '100'
    },
    {
      id: '2',
      name: '200'
    },
    {
      id: '3',
      name: '300'
    }
  ];
  selectModel = this.selectCollection[0];

  ngOnInit() {
    this.perPage = this.perPage || this.defaultPerPage;
    this.perPageData = _map((value) => Object({perPage: value}))(this.perPageVariants);
  }

  ngOnChanges() {
    this.buildPages();
  }

  /**
   * Сформировать массив страниц для отображения
   */
  private buildPages() {
    const byLine = 3;
    const offsetLeft = 1;
    const offsetRight = 1;
    if (this.totalPages > byLine) { // 7
      if (this.page < byLine) {
        this.pagesToShow = [..._range(1, byLine + 1)];
      } else if (this.page > (this.totalPages - byLine + offsetRight)) { // 9
        this.pagesToShow = [..._range(this.totalPages - byLine + 1, this.totalPages + 1)];
      } else if (this.page >= byLine && this.page <= this.totalPages - byLine) { // 8
        this.pagesToShow = [..._range(this.page - (byLine - offsetLeft),
          this.page + (byLine - offsetRight))];
      }
    } else {
      this.pagesToShow = [..._range(1, this.totalPages + 1)];
    }
  }

  /**
   * Выбрать страницу
   */
  setPage(page: any) {
    if (page === '...' || page === this.page) {
      return;
    }

    this.page = page;
    this.buildPages();
    this.pageChange.emit(this.page);
  }

  /**
   * Выбрать предыдущую старницу
   */
  prevPage() {
    if (this.page > 1) {
      const page = this.page - 1;
      this.setPage(page);
    }
  }

  /**
   * Выбрать следующую страницу
   */
  nextPage() {
    if (this.page < this.totalPages) {
      const page = this.page + 1;
      this.setPage(page);
    }
  }

  /**
   * Изменить число записей для отображение на странице
   */
  switchPerPage(perPage: any) {
    this.perPage = perPage;
    this.perPageChange.emit(this.perPage);
  }

  onChangeValue($event: any) {
    this.switchPerPage($event);
  }
}
