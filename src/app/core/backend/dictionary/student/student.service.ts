import { Injectable } from '@angular/core';
import { Constants } from '@core/constants';
import { HttpClient } from '@angular/common/http';
import { Student } from '@core/backend/dictionary/student/student.interface';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private readonly URL = `${Constants.DICTIONARY_API_URL}/student`;

  constructor(private http: HttpClient) {}

  getList(): Promise<Student[]> {
    return firstValueFrom(this.http.get<Student[]>(this.URL));
  }
}
