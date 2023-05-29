import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterEvent } from '@angular/router';
import { filter } from 'rxjs';


@Component({
  selector: 'hse-references-header',
  templateUrl: './hse-references-header.component.html',
  styleUrls: ['./hse-references-header.component.scss']
})
export class HseReferencesHeaderComponent implements OnInit {

  digitalTools = [
    {
      id: 0,
      key: 'USAGE_AREA'
    },
    {
      id: 1,
      key: 'METHODS'
    },
    {
      id: 2,
      key: 'PROGRAMS'
    },
    {
      id: 3,
      key: 'PROGRAM_LANGUAGES'
    },
    {
      id: 4,
      key: 'PYTHON_LIBRARIES'
    },
    {
      id: 5,
      key: 'DATA_TOOLS'
    },
  ];
  isMainReferences: boolean;

  constructor(private route: Router, private changeDetectorRefs: ChangeDetectorRef, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.isMainReferences = window.location.pathname.includes('references/main');
    // this.getRoute();
  }

  getRoute() {
    this.route.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.isMainReferences = event.url.includes('references/main');
      console.log('azaza = ', this.isMainReferences);
      this.changeDetectorRefs.detectChanges();

    });
  }
}
