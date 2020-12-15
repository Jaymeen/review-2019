import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { constant } from '../../app.const';
import { EncryptionService } from './encryption.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService implements HttpInterceptor {

  token: string = null;
  userData: string;
  constructor(private router: Router,
    private encryptionService: EncryptionService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.token = localStorage.getItem('token');
    this.userData = localStorage.getItem('userdata');
    if (this.token && this.userData) {
      request = request.clone({
        setHeaders: { 'Authorization': `Bearer ${this.token}` }
      });
      return next.handle(request)
        .pipe(
          tap(event => { }, error => {
            if (error.error.code === "JWTFALSE" || error.error.code === "TOKENFALSE") {
              localStorage.clear();
              this.router.navigate(['sessionexpire']);
            }
          })
        )
    }
    else {
      if (this.router.url === '/login' || this.router.url === '/') {
        return next.handle(request);
      }
      else {
        localStorage.clear();
        window.location.href = '/';
        return next.handle(request);
      }

    }
  }

  getToken(): boolean {
    return (!!localStorage.getItem('token'));
  }
  getRole(): String {
    let userData = JSON.parse(localStorage.getItem('userdata'));
    if (userData) {
      userData.role = this.encryptionService.get(
        constant.ENCRYPTIONKEY,
        userData.role
      );
      return userData.role;
    }
    else {
      return '';
    }

  }
}
