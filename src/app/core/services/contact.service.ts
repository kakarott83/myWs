import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export type MailPayload = { name: string; email: string; message: string };

@Injectable({ providedIn: 'root' })
export class ContactService {
  private http = inject(HttpClient);

  sendMail(payload: MailPayload) {
    // Proxy leitet /api/mail an deinen Node-Server (Port 3000) weiter
    return firstValueFrom(this.http.post<{ ok: boolean; id?: string }>('/api/mail', payload));
  }
}