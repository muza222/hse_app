import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Course } from '@core/backend/dictionary/course/course.interface';
import { firstValueFrom } from 'rxjs';
import { Constants } from '@core/constants';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private readonly URL = `${Constants.DICTIONARY_API_URL}/course`;

  constructor(private http: HttpClient) {}

  getList(params = {}): Promise<Course[]> {
    return firstValueFrom(this.http.get<Course[]>(this.URL, {params}));
  }
}
