import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { catchError, map, Observable, Subscription, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {

  private eventSource: EventSource | null = null;
  private eventSubscription: Subscription | null = null;

  constructor(private http: HttpClient) { }

  apiEndpoint: string = "http://127.0.0.1:8000";

  sendMessageToBot(requestBody: any): Observable<any> {
    return this.http.post<any>(`${this.apiEndpoint}/chat/query_url`, requestBody);
  }

  sendMessageToBotSQL(requestBody: any): Observable<any> {
    return this.http.get<any>(`${this.apiEndpoint}/chat-sql/query_sql/${requestBody.query}/${requestBody.model}/${requestBody.temperature}`);
  }

  addUrl(requestBody: any): Observable<any> {
    return this.http.post<any>(`${this.apiEndpoint}/chat/ingest_url`, requestBody);
  }

  deleteUrl(requestBody: any): Observable<any> {
    return this.http.post<any>(`${this.apiEndpoint}/chat/delete_url`, requestBody);
  }

  listUrls(): Observable<any> {
    return this.http.get<any>(`${this.apiEndpoint}/chat/get_urls`);
  }

  getChatStream(requestBody: any): Observable<string> {
    return this.http.post(`${this.apiEndpoint}/chat/query_url_stream`, requestBody, {
      responseType: 'text',
      observe: 'events',
    }).pipe(
      catchError(error => {
        console.error('Error fetching stream:', error);
        return throwError(error);
      }),
      map(event => {
        if (event.type === HttpEventType.Response) {
          console.log('Stream complete:', event);
          return event.body as string;
        }
        return '';
      })
    );
  }




}
