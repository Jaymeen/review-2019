import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../../environments/enviroment.dev';
import { NgxSpinnerService } from 'ngx-spinner';


//This is used for list-template and preview-template components.

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  private url: string = `${environment.backendEndpoint}/template`;

  constructor(private http: HttpClient,private spinner:NgxSpinnerService) { }


  // to make get request to the server for sessions
  getTemplates(pagesize: number, pageindex: number, searchString: string, status: string, sortfield: string, order: number, userId: number): Observable<any[]> {
    this.spinner.show();
    let templateData = {
      "pageSize": pagesize,
      "pageIndex": pageindex,
      "status": status,
      "sort": sortfield,
      "order": order,
      "search": searchString,
      "userId": userId
    }
    return this.http.post<any[]>(`${this.url}/template-list`, templateData);
  }

  deleteTemplate(index: number, userId: number): Observable<any> {
    this.spinner.show();
    return this.http.delete<any>(`${this.url}?templateId=${index}&userId=${userId}`);
  }

  getTemplateById(template_id): Observable<any> {
    this.spinner.show();
    return this.http.get<any>(`${this.url}/template-details/${template_id}`);
  }
}
