import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../../environments/enviroment.dev';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private url = `${environment.backendEndpoint}/notification`;

  constructor(private http: HttpClient,private spinner:NgxSpinnerService) { }

  getAllNotifications(userId: number,hideSpinner) {
    if(!hideSpinner){
    this.spinner.show();
    }
    return this.http.get<any[]>(`${this.url}/list?userId=${userId}&flag=all`);
  }

  getLatestTenNotifications(userId: number) {
    return this.http.get<any>(`${this.url}/list?userId=${userId}&flag=new`);
  }

  markOneAsRead(notificationId: number) {
    return this.http.get<any>(`${this.url}/read?notificationId=${notificationId}`);
  }

  markAllAsRead(userId: number) {
    return this.http.get<any>(`${this.url}/readall?userId=${userId}`);
  }

  deleteOneNotification(notificationId: number) {
    return this.http.delete<any>(`${this.url}/delete?notificationId=${notificationId}`)
  }
}