import { Injectable } from '@angular/core';
import { Constants } from '@core/constants';
import { HttpClient } from '@angular/common/http';
import { Program } from '@core/backend/dictionary/program/program.interface';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProgramService {
  private readonly URL = `${Constants.DICTIONARY_API_URL}/program`;

  constructor(private http: HttpClient) {}

  getList(params = {}): Promise<Program[]> {
    return firstValueFrom(this.http.get<Program[]>(this.URL, {params}));
  }
}
