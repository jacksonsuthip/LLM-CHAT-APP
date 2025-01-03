import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private http: HttpClient) { }

  apiEndpoint:string = "";

  sendMessageToBot(requestBody: any): Observable<any> {
    // Replace with your actual API endpoint
    return this.http.post<any>('http://127.0.0.1:8000/chat/query_url', requestBody);
  }
}
