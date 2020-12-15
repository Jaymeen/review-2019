import { map } from 'rxjs/operators';

import { environment } from './../../../environments/enviroment.dev';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToasterService } from 'src/app/shared/services/toaster.service';
import { NgxSpinnerService } from 'ngx-spinner';
@Injectable({
  providedIn: 'root'
})

export class SessionsService {

  private _url: string = `${environment.backendEndpoint}/session`;
  constructor(private http: HttpClient, private router: Router,
    public toast: ToasterService, private spinner: NgxSpinnerService) { }


  // to make get request to the server for sessions
  getSessions(pagesize: number, pageindex: number, search: string, status: string, sortAttribute: string, order: any): Observable<any[]> {
    // return this.http.get<any[]>(`${this._url}/session-list?pageSize=${pagesize}&pageIndex=${pageindex}&status=${status}&sort=${sortAttribute}&order=${order}&search=${search}`);
    this.spinner.show();
    let sessionData = {
      "pageSize": pagesize,
      "pageIndex": pageindex,
      "status": status,
      "sort": sortAttribute,
      "order": order,
      "search": search
    }
    return this.http.post<any[]>(`${this._url}/session-list`, sessionData);
  }

  getTemplates(): Observable<any[]> {
    return this.http.get<any[]>(`${this._url}/templates`);
  }

  // to delete session details from database
  deleteSession(session_id: number, userId: number) {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    let url = `${this._url}/session-delete?sessionId=${session_id}&userId=${userId}`;
    return this.http
      .delete(url, { headers: headers });
  }
  // get data when update session is clicked
  getSessionById(index): any {
    return this.http.get<any>(`${this._url}/session-details/${index}`);
  }

  // to add session details into database
  addSession(session: any) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    const url = `${this._url}/create`;
    return this.http.post<any>(url, session, { headers: headers });
  }

  // to update session-details from database using session-id
  editSession(session: any, index) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    const url = `${this._url}/updateById/${index}`;
    return this.http.put<any>(url, session, { headers: headers });
  }

  loadMappingData(session_id: number, pageSize: number, pageIndex: number, sortAttribute: string, order: any): Observable<any[]> {
    this.spinner.show();
    let mapData = {
      "pageSize": pageSize,
      "pageIndex": pageIndex,
      "sort": sortAttribute,
      "order": order
    }
    return this.http.post<any[]>(`${this._url}/session-mapping-details/${session_id}`, mapData);
  }
}
