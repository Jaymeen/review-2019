import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/enviroment.dev';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {

  templateIdAndName : any;

  //server url temporary
  private _url: string = `${environment.backendEndpoint}/template`;
  constructor(private http: HttpClient,private spinner:NgxSpinnerService) {

  }

  storePreviewTemplate(template: any): Observable<any> {
    this.spinner.show();
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.post<any>(this._url, template, { headers: headers });
  }

  getSavedTemplate(userId){
    this.spinner.show();
    let url = `${this._url}/template-details/${userId}`;
    return this.http.get<any>(url);

  }

  createTemplate(template: any): Observable<any> {
    this.spinner.show();
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.post<any>(this._url, template, { headers: headers });
  }

  getTemplate(templateId: any): Observable<any> {
    this.spinner.show();
    let url = `${this._url}/template-details/${templateId}`;
    return this.http.get<any>(url);
  }

  updateTemplate(templateId: any, templateObject): Observable<any> {
    this.spinner.show();
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    let url = `${this._url}?template_id=${templateId}`;
    return this.http.post<any>(url, templateObject, { headers: headers });
  }

  storeTemplateIdAndName(templateIdAndName){
    this.templateIdAndName = templateIdAndName;
  }
  retriveTemplateIdAndName(){
    return this.templateIdAndName;
  }

}
