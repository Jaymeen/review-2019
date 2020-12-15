import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../../environments/enviroment.dev';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class SessionTemplateMappingService {

  // server url temporary
  private _url = `${environment.backendEndpoint}/session`;

  constructor(private http: HttpClient,private spinner:NgxSpinnerService) { }

  //to make get request to the server

  getMappings(pagesize: number, pageindex: number, search: string, status: string, sortAttribute: string, order: any, sessionStatus: number): Observable<any[]> {
    // tslint:disable-next-line:max-line-length
    // return this.http.get<any[]>(`${this._url}/mapping-list?pageSize=${pagesize}&pageIndex=${pageindex}&status=${status}&sort=${sortAttribute}&order=${order}&sessionStatus=${sessionStatus}&search=${search}`);
    this.spinner.show();
    let mapData = {
      "pageSize":pagesize,
      "pageIndex":pageindex,
      "status":status,
      "sort":sortAttribute,
      "order":order,
      "sessionStatus":sessionStatus,
      "search":search
    }
    return this.http.post<any[]>(`${this._url}/mapping-list`, mapData);
  }
}
