import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../../environments/enviroment.dev';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class ResponseService {

  private url = `${environment.backendEndpoint}/review`;

  constructor(private http: HttpClient,private spinner:NgxSpinnerService) { }

  getRecords( mappingId: number ) : Observable<any> {
    this.spinner.show();
    return this.http.get<any>(`${this.url}/review-data/${mappingId}`);
  }

  getResponse( mappingId: number ) : Observable<any> {
    this.spinner.show();
    return this.http.get<any>(`${this.url}/response-data/${mappingId}`);
  }

  getComments( mappingId: number ) : Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/comments-list/${mappingId}`);
  }

  sendComment( data: any ) : Observable<any> {
    this.spinner.show();
    return this.http.post<any>(`${this.url}/add-comment`,data);
  }

  updateComment( data: any[] ) : Observable<any> {
    this.spinner.show();
    return this.http.put<any>(`${this.url}/update-comment`, {"commentId": data});
  }

  publishreview( mappingId: number, userId: number ) : Observable<any> {
    this.spinner.show();
    return this.http.put<any>(`${this.url}/publish-review`, {"mappingId":mappingId, "userId":userId});
  }
}
