import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SessionStoreService } from '@core/session-store/session-store.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private sessionStoreService: SessionStoreService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const accessToken = this.sessionStoreService.getAccessToken();
    if (!accessToken) {
      return next.handle(req);
    }
    const authReq = req.clone({
      headers: req.headers.set('access-token', accessToken)
    });

    return next.handle(authReq);
  }
}
