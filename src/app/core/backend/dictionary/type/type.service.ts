import { Injectable } from '@angular/core';
import { Constants } from '@core/constants';
import { HttpClient } from '@angular/common/http';
import { Type } from '@core/backend/dictionary/type/type.interface';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TypeService {
  private readonly URL = `${Constants.DICTIONARY_API_URL}/type`;

  constructor(private http: HttpClient) {}

  getList(): Promise<Type[]> {
    return firstValueFrom(this.http.get<Type[]>(this.URL));
  }
}
