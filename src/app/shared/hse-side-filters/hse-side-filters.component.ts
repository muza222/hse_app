import { Component, OnInit } from '@angular/core';
import { SideFiltersService } from '@shared/hse-side-filters/side-filters.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'hse-side-filters',
  templateUrl: './hse-side-filters.component.html',
  styleUrls: ['./hse-side-filters.component.scss']
})
export class HseSideFiltersComponent implements OnInit{
  showSideNav: Observable<boolean>;

  constructor(private sideFilterService: SideFiltersService) {}

  ngOnInit(): void {
    this.showSideNav = this.sideFilterService.getShowNav();
  }

  onSidebarClose() {
    this.sideFilterService.setShowNav(false);
  }
}
