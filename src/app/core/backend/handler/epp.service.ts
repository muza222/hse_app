import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from '@core/constants';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class EppService {
  private readonly URL = `${Constants.HANDLER_API_URL}`;

  constructor(private http: HttpClient) { }

  getMyEppList(): Promise<any> {
    return firstValueFrom(this.http.get(`${this.URL}/epp/my`));
  }

  getAllEppList(): Promise<any> {
    return firstValueFrom(this.http.get(`${this.URL}/epp`));
  }

  save(epp: any) {
    return firstValueFrom(this.http.post(`${this.URL}/epp`, epp));
  }

  update(epp: any, eppId, action?: 'rework' | 'review') {
    let queryParams;
    if (action === 'rework') {
      queryParams = {isRework: true};
    }
    else if (action === 'review') {
      queryParams = {isReview: true};
    }
    const params = {
      params: queryParams
    };
    return firstValueFrom(this.http.put(`${this.URL}/epp/${eppId}`, epp, params));
  }

  deleteEpp(id) {
    return firstValueFrom(this.http.delete(`${this.URL}/epp/${id}`));
  }

}
