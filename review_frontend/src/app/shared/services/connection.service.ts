import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../../environments/enviroment.dev';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {
  private url: string = `${environment.backendEndpoint}/login`;

  constructor(private http: HttpClient,private spinner:NgxSpinnerService) { }

  getUser(tmail: string): Observable<any> {
    this.spinner.show();
    return this.http.get<any>(`${this.url}/${tmail}`);
  }
}