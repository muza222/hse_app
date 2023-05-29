import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Constants } from '@core/constants';
import { BaseEntity } from '@core/interfaces/base-entity.interface';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  private readonly URL = `${Constants.DICTIONARY_API_URL}/tag`;

  constructor(private http: HttpClient) {}

  getList(): Promise<BaseEntity[]> {
    return firstValueFrom(this.http.get<BaseEntity[]>(this.URL));
  }

  createTag(formData: Partial<BaseEntity>): Promise<BaseEntity> {
    return firstValueFrom(this.http.post<BaseEntity>(this.URL, formData));
  }
  updateTag(formData: Partial<BaseEntity>): Promise<BaseEntity> {
    return firstValueFrom(this.http.put<BaseEntity>(this.URL, formData));
  }
  removeTag(id) {
    return firstValueFrom(this.http.delete(`${this.URL}/${id}`, {responseType: 'text'}));
  }
}
