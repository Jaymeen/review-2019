import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../../environments/enviroment.dev';
import { Observable } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {
  private url: string = `${environment.backendEndpoint}/review`;
  constructor(public http:HttpClient,private spinner:NgxSpinnerService) { }
  submitReview(review: any) {
    this.spinner.show();
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.post<any>(`${this.url}/review-response`, review, { headers: headers });
  }
  updateReview(review: any,  mappingId: number) {
    this.spinner.show();
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.post<any>(`${this.url}/update-review/${mappingId}`, review, { headers: headers });
  }
  getRecords( mappingId: number ) : Observable<any> {
    this.spinner.show();
    return this.http.get<any>(`${this.url}/review-data/${mappingId}`);
  }
}
