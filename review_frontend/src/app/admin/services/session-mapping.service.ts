import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from './../../../environments/enviroment.dev';

@Injectable({
  providedIn: 'root'
})

export class SessionMappingService {
  private _url: string = `${environment.backendEndpoint}/session/session-mapping`;


  constructor(private http: HttpClient, private router: Router) { }

  addMappingDetails(sessionId: number, userId: number, mappingArray: any[]): Observable<any> {
    return this.http.post<void>(`${this._url}/mapping/${sessionId}?userId=${userId}`, mappingArray);
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this._url}/users`);
  }

  getTemplates(): Observable<any[]> {
    return this.http.get<any[]>(`${this._url}/templates`);
  }
}
