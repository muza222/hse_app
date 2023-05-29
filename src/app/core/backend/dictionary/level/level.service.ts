import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Level } from '@core/backend/dictionary/level/level.interface';
import { firstValueFrom } from 'rxjs';
import { Constants } from '@core/constants';

@Injectable({
  providedIn: 'root'
})
export class LevelService {
  private readonly URL = `${Constants.DICTIONARY_API_URL}/level`;

  constructor(private http: HttpClient) {}

  getList(): Promise<Level[]> {
    return firstValueFrom(this.http.get<Level[]>(this.URL));
  }
}
