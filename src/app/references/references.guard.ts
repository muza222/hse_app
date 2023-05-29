import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { UserType } from '@core/enums';
import { SessionStoreService } from '@core/session-store/session-store.service';

@Injectable({
  providedIn: 'root'
})
export class ReferencesGuard implements CanActivate {
  ALLOW_USER_TYPES = [UserType.STUDENT, UserType.EMPLOYEE, UserType.SUPERVISOR];
  constructor(private sessionStoreService: SessionStoreService) { }

  canActivate(routeSnapshot: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const session = this.sessionStoreService.getSession();
    return Boolean(session && this.ALLOW_USER_TYPES.includes(session.activeRole.name));
  }
}
