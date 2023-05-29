import { Injectable } from '@angular/core';
import { Constants } from '@core/constants';
import { HttpClient } from '@angular/common/http';
import { Employee } from '@core/backend/dictionary/employee/employee.interface';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private readonly URL = `${Constants.DICTIONARY_API_URL}/employee`;

  constructor(private http: HttpClient) {}

  getList(name?): Promise<Employee[]> {
    let fullUrl = this.URL;

    if (name) {
      fullUrl += `?name=${name}`;
    }

    return firstValueFrom(this.http.get<Employee[]>(fullUrl));
  }
}
