import { Injectable } from '@angular/core';
import { environment } from './../../../environments/enviroment.dev';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class RevieweeListService {

  private url = `${environment.backendEndpoint}/user`;

  constructor(private httpClient: HttpClient,private spinner:NgxSpinnerService) { }

  getRevieweeList(userId: number, pageSize: number, pageIndex: number, search: string, status: string,
    sortAttribute: string, sortOrder: number): Observable<any[]> {
    // return this.httpClient.get<any[]>(`${this.url}/dashboard?userId=${userId}&pageSize=${pageSize}&pageIndex=${pageIndex}&status=${status}&sort=${sortAttribute}&order=${sortOrder}&search=${search}`);
    this.spinner.show();
    let revieweeData = {
      "userId":userId,
      "pageSize":pageSize,
      "pageIndex":pageIndex,
      "status":status,
      "sort":sortAttribute,
      "order":sortOrder,
      "search":search
    }
    return this.httpClient.post<any[]>(`${this.url}/dashboard`, revieweeData);
  }

  getReviewerList(userId: number, pageSize: number, pageIndex: number, search: string, status: string,
    sortAttribute: string, sortOrder: number): Observable<any[]> {
    // return this.httpClient.get<any[]>(`${this.url}/my-reviews?userId=${userId}&pageSize=${pageSize}&pageIndex=${pageIndex}&status=${status}&sort=${sortAttribute}&order=${sortOrder}&search=${search}`);
    this.spinner.show();
    let reviewerData = {
      "userId":userId,
      "pageSize":pageSize,
      "pageIndex":pageIndex,
      "status":status,
      "sort":sortAttribute,
      "order":sortOrder,
      "search":search
    }
    return this.httpClient.post<any[]>(`${this.url}/my-reviews`, reviewerData);
  }
}
