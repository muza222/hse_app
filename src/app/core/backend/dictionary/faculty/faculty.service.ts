import { Injectable } from '@angular/core';
import { Constants } from '@core/constants';
import { HttpClient } from '@angular/common/http';
import { Unit } from '@core/backend/dictionary/unit/unit.interface';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FacultyService {
  private readonly URL = `${Constants.DICTIONARY_API_URL}/faculty`;

  constructor(private http: HttpClient) {}

  getList(params = {}): Promise<Unit[]> {
    return firstValueFrom(this.http.get<Unit[]>(this.URL, {params}));
  }
}
