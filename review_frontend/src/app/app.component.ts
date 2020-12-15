import { Component } from '@angular/core';
import { ToasterService } from './shared/services/toaster.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BaseService } from './base/services/base.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public showBars: boolean;
  sidebarOpened: boolean = true;
  subscription: Subscription;
  constructor(public toast: ToasterService, public router: Router, public baseService: BaseService) { 
    
  }
  changeOfRoutes() {
    if (this.router.url === '/login' || this.router.url === '/' || this.router.url === '/errorpage' || this.router.url === '/sessionexpire') // if it is login page
    {
      this.showBars = false;
    } else {
      this.showBars = true;
      this.baseService.setRoutes(this.router.url);
    }
  }

  ngOnInit() {
    this.setSidebar();
  }
  setSidebar() {
    this.subscription = this.baseService.clickBehaviourSubject.subscribe(data => {
      this.sidebarOpened = data;
    });
  }
}
