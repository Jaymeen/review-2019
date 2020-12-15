import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRoute } from '@angular/router';
import { AuthorizationService } from './services/authorization.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth:  AuthorizationService ,private myRoute: Router , private activatedRoute : ActivatedRoute){}

  canActivate(): boolean {
    if (this.auth.getToken()) {
      // this.myRoute.navigateByUrl(this.myRoute.url);
      return true;
    } else {
      localStorage.clear();
      window.location.href = '/';
      return false;
    }
  }
}
