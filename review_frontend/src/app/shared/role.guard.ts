import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthorizationService } from './services/authorization.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private auth:  AuthorizationService ,private myRoute: Router, ){}

  canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot): boolean {    
    if (this.auth.getRole() === activatedRouteSnapshot.data.role) {
      return true;
    } else {
      localStorage.clear();
      window.location.href = '/';
      return false;
    }
  }
}
