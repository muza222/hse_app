import { Component, Inject, OnInit } from '@angular/core';
import { LeftMenuItemId } from '@shared/modules/left-menu/constants';

import { UserType } from '@enums/user-type.enum';
import { LeftMenuItem } from '@shared/modules/left-menu/types/left-menu-item.interface';
import { DOCUMENT } from '@angular/common';
import { LeftMenuService } from '@shared/modules/left-menu/services/left-menu.service';

@Component({
  selector: 'hse-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.scss']
})
export class LeftMenuComponent implements OnInit {

  private readonly LEFT_MENU_STATE_KEY = 'left-menu-state';
  private readonly LEFT_MENU_STATE_VALUE = 'closed';
  public readonly menuIteIds = LeftMenuItemId;

  public currentHoverId: LeftMenuItemId = null;
  public menuIsOpen = true;
  panelOpenState = false;

  public firstBlockMenu: LeftMenuItem[] = [
    {
      id: LeftMenuItemId.FAIR,
      nameKey: 'LEFT_MENU.ALL_APPLICATIONS',
      icon: 'home',
      link: '/',
      linkOptions: true,
      userTypes: [],
      featureIsAvailable: true,
      authRequired: false,
    },
    // {
    //   id: LeftMenuItemId.MY_EPP,
    //   nameKey: 'LEFT_MENU.MY_EPP',
    //   icon: 'corporate',
    //   link: '/my-epp',
    //   linkOptions: true,
    //   userTypes: [],
    //   //userTypes: [UserType.EPP_STUDENT, UserType.EPP_EMPLOYEE, UserType.EPP_SUPERVISOR, UserType.EPP_MANAGER_FACULTY, UserType.EPP_MANAGER_PROGRAM],
    //   featureIsAvailable: true,
    //   authRequired: false,
    // },
    {
      id: LeftMenuItemId.ALL_APPLICATIONS,
      nameKey: 'LEFT_MENU.MY_APPLICATIONS',
      icon: 'task',
      link: '/all-applications',
      linkOptions: true,
      userTypes: [],
      featureIsAvailable: true,
      authRequired: false,
    },
  ];

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private leftMenuService: LeftMenuService,
  ) {
    const menuState = this.getMenuStateFromStorage();
    this.menuIsOpen = menuState !== this.LEFT_MENU_STATE_VALUE;
    this.updateMenuStateCSSClass(this.menuIsOpen);

    this.leftMenuService.toggleMenu$
      .subscribe(
        () => this.toggleMenu(),
      );
  }

  ngOnInit() { }

  mouseEnter($event: any, id: LeftMenuItemId) {
    this.currentHoverId = id;
  }

  mouseLeave($event: any) {
    this.currentHoverId = null;
  }

  toggleMenu() {
    this.menuIsOpen = !this.menuIsOpen;
    this.updateMenuStateCSSClass(this.menuIsOpen);
    this.saveMenuStateToStorage(this.menuIsOpen);
  }

  private saveMenuStateToStorage(menuIsOpen: boolean) {
    try {
      if (menuIsOpen) {
        localStorage.removeItem(this.LEFT_MENU_STATE_KEY);
      } else {
        localStorage.setItem(this.LEFT_MENU_STATE_KEY, this.LEFT_MENU_STATE_VALUE);
      }
    } catch (e) {
      console.error(e);
    }
  }

  private getMenuStateFromStorage() {
    try {
      return localStorage.getItem(this.LEFT_MENU_STATE_KEY);
    } catch (e) {
      return '';
    }
  }

  private updateMenuStateCSSClass(menuIsOpen: boolean) {
    if (menuIsOpen) {
      this.document.body.classList.add('left-menu-is-open');
    } else {
      this.document.body.classList.remove('left-menu-is-open');
    }
  }

}
