import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

import { ApiResponse, Entry } from './api.types';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // Base URL is now taken from environment for easy switching between dev / prod
  private readonly apiBase = environment.apiBase;

  constructor(private readonly http: HttpClient) {}

  /** Centralised error handling for all API calls */
  private handleError(err: HttpErrorResponse) {
    console.error('API error:', err);
    // Propagate a user‑friendly error downstream
    return throwError(() => new Error(err.message));
  }

  getNewEntries(): Observable<Entry[]> {
    return this.http
      .get<Entry[]>(`${this.apiBase}/backend/api/admin/getNewEntries.php`)
      .pipe(catchError(this.handleError));
  }

  approveOrDiscardNewEntry(entry: Entry): Observable<ApiResponse> {
    // HttpClient automatically serialises the payload to JSON
    return this.http
      .put<ApiResponse>(`${this.apiBase}/backend/api/admin/approveOrDiscardNewEntry.php`, entry)
      .pipe(catchError(this.handleError));
  }

  sendEmailEnglish(entry: Entry): Observable<ApiResponse> {
    return this.http
      .post<ApiResponse>(`${this.apiBase}/backend/api/admin/emailer/sendEmailEnglish.php`, entry)
      .pipe(catchError(this.handleError));
  }

  sendEmailGerman(entry: Entry): Observable<ApiResponse> {
    return this.http
      .post<ApiResponse>(`${this.apiBase}/backend/api/admin/emailer/sendEmailGerman.php`, entry)
      .pipe(catchError(this.handleError));
  }
}
