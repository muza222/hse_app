import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { SessionStoreService } from '@core/session-store/session-store.service';


@Directive({
  selector: '[hseIsAuth]'
})
export class IsAuthDirective implements OnInit {

  @Input('hseIsAuth') isAuth: boolean;

  constructor(private container: ViewContainerRef,
              private template: TemplateRef<any>,
              private sessionStore: SessionStoreService) { }

  ngOnInit() {
    this.sessionStore.session$.subscribe(() => this.checkAuth());
  }
  checkAuth() {
    this.container.clear();
    // show for auth

    if (this.isAuth && this.sessionStore.session) {
      this.container.createEmbeddedView(this.template);
    }

    // show for unauth
    if (!this.isAuth && !this.sessionStore.session) {
      this.container.createEmbeddedView(this.template);
    }
  }

}
