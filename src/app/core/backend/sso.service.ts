import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Constants } from '@core/constants';

@Injectable({
  providedIn: 'root'
})
export class SsoService {
  private readonly URL = `${Constants.SSO_API_URL}`;

  constructor(private http: HttpClient) {}

  async auth(): Promise<void> {
    const params = {
      back_url: window.location.href,
      'system-name': 'epp'
    };

    const headers = {
      'system-name': 'epp'
    };

    const httpHeaders = new HttpHeaders(headers);
    const httpParams = new HttpParams({fromObject: params});

    const redirectUri = await firstValueFrom(this.http.get(`${this.URL}/auth`, {
      params: httpParams,
      headers: httpHeaders,
      responseType: 'text'
    }));

    window.location.assign(redirectUri);
  }

  getUser(): Promise<any> {
    return firstValueFrom(this.http.get(`${this.URL}/user`));
  }

  async setActiveRole(user): Promise<any> {
    await firstValueFrom(this.http.put(`${this.URL}/set_active_role`, user, {
      params: { role: user.activeRole.name }
    }));
    window.location.assign('/');
  }

  async logout(): Promise<void> {
    const redirectUri = await firstValueFrom(this.http.get(`${this.URL}/logout`, {
      params: { back_url: window.location.origin },
      responseType: 'text'
    }));

    window.location.assign(redirectUri);
  }
}
