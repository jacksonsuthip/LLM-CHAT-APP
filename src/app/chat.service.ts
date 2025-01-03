// chat.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ChatService {
    constructor(private http: HttpClient) { }

    sendMessageToBot(message: string): Observable<any> {
        return this.http.post<any>('https://your-llm-api-endpoint.com/chat', { message });
    }
}
