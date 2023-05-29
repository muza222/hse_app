import { Injectable } from '@angular/core';
import { Constants } from '@core/constants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class FileStorageService {
  private readonly URL = window.location.hostname === 'localhost' ? `${Constants.FILE_STORAGE_API_URL}` : `${environment.storageUrl}${Constants.FILE_STORAGE_API_URL}`;

  constructor(private httpClient: HttpClient) { }

  getFileHead(fileUrl) {
    return firstValueFrom(this.httpClient.head(fileUrl, {observe: 'response'}));
  }

  uploadFile(file: Blob): Promise<any> {
    // const execFile: any =  file;
    // поддерживаемые форматы файлов
    // const fileType = /(\.jpg|\.jpeg|\.png|\.svg|\.mp3|\.ppt|\.pptx|\.pdf)$/i;

    // if (!fileType.exec(execFile.name)) {
    //   return Promise.reject('unsupported file type');
    // }
    const headers = {
      'system-name': 'epp'
    };
    const httpHeaders = new HttpHeaders(headers);
    const formData: FormData = new FormData();
    formData.append('file', file);

    return this.httpClient.post(`${this.URL}/file?app_name=epp`, formData, {
      headers: httpHeaders,
      responseType: 'text'
    }).toPromise();
  }

  deleteFile(uuid: string) {
    return firstValueFrom(this.httpClient.delete(`${this.URL}/file/${uuid}?app_name=epp`));
  }

}
