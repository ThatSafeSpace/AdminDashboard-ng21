import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiResponse, Entry} from './api.types';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  protected readonly PHP_API_SERVER = "https://thatsafespace.net";

  constructor(protected readonly http: HttpClient) {}

  getNewEntries(): Observable<Entry[]> {
    return this.http.get<Entry[]>(`${this.PHP_API_SERVER}/backend/api/admin/getNewEntries.php`);
  }

  approveOrDiscardNewEntry(entry: Entry): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.PHP_API_SERVER}/backend/api/admin/approveOrDiscardNewEntry.php`, JSON.stringify(entry));
  }

  sendEmailEnglish(entry: Entry): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.PHP_API_SERVER}/backend/api/admin/emailer/sendEmailEnglish.php`, JSON.stringify(entry));
  }

  sendEmailGerman(entry: Entry): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.PHP_API_SERVER}/backend/api/admin/emailer/sendEmailGerman.php`, JSON.stringify(entry));
  }

}
