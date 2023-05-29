import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Constants } from '@core/constants';
import { BaseEntity } from '@core/interfaces/base-entity.interface';

@Injectable({
  providedIn: 'root'
})
export class DtService {
  private readonly URL = `${Constants.DICTIONARY_API_URL}/dt`;

  constructor(private http: HttpClient) {}

  getUsageAreaList(): Promise<BaseEntity[]> {
    return firstValueFrom(this.http.get<BaseEntity[]>(`${this.URL}_usage_area`));
  }

  getPythonLibList(): Promise<BaseEntity[]> {
    return firstValueFrom(this.http.get<BaseEntity[]>(`${this.URL}_python_libraries`));
  }

  getMethodList(): Promise<BaseEntity[]> {
    return firstValueFrom(this.http.get<BaseEntity[]>(`${this.URL}_methods`));
  }

  getProgramLanguageList(): Promise<BaseEntity[]> {
    return firstValueFrom(this.http.get<BaseEntity[]>(`${this.URL}_program_languages`));
  }

  getProgramList(): Promise<BaseEntity[]> {
    return firstValueFrom(this.http.get<BaseEntity[]>(`${this.URL}_programs`));
  }

  getDataToolList(): Promise<BaseEntity[]> {
    return firstValueFrom(this.http.get<BaseEntity[]>(`${this.URL}_data_tools`));
  }
  createDt(formData: Partial<BaseEntity>, id): Promise<BaseEntity> {
    return firstValueFrom(this.http.post<BaseEntity>(`${this.URL}/${id}`, formData));
  }
  updateDt(formData: Partial<BaseEntity>): Promise<BaseEntity> {
    return firstValueFrom(this.http.put<BaseEntity>(this.URL, formData));
  }
  removeDt(id) {
    return firstValueFrom(this.http.delete(`${this.URL}/${id}`, {responseType: 'text'}));
  }
}
