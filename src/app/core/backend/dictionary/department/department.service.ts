import { Injectable } from '@angular/core';
import { Constants } from '@core/constants';
import { HttpClient } from '@angular/common/http';
import { Unit } from '@core/backend/dictionary/unit/unit.interface';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private readonly URL = `${Constants.DICTIONARY_API_URL}/department`;

  constructor(private http: HttpClient) {}

  getList(): Promise<Unit[]> {
    return firstValueFrom(this.http.get<Unit[]>(this.URL));
  }
}
