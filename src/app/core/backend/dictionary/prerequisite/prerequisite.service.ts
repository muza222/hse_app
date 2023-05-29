import { Injectable } from '@angular/core';
import { Constants } from '@core/constants';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { BaseEntity } from '@core/interfaces/base-entity.interface';

@Injectable({
  providedIn: 'root'
})
export class PrerequisiteService {
  private readonly URL = `${Constants.DICTIONARY_API_URL}/prerequisite`;

  constructor(private http: HttpClient) {}

  getList(): Promise<BaseEntity[]> {
    return firstValueFrom(this.http.get<BaseEntity[]>(this.URL));
  }

  createPrerequisite(formData: Partial<BaseEntity>): Promise<BaseEntity> {
    return firstValueFrom(this.http.post<BaseEntity>(this.URL, formData));
  }

  updatePrerequisite(formData: Partial<BaseEntity>): Promise<BaseEntity> {
    return firstValueFrom(this.http.put<BaseEntity>(this.URL, formData));
  }
  removePrerequisite(id) {
    return firstValueFrom(this.http.delete(`${this.URL}/${id}`, {responseType: 'text'}));
  }
}
