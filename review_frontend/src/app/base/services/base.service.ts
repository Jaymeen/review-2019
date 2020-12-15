import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class BaseService {
  isOpened: boolean = false;
  clickBehaviourSubject = new BehaviorSubject<any>(false);
  notificationCountSubject = new BehaviorSubject<number>(-2);
  changeOfRoutesBehaviourSubject = new BehaviorSubject<any>('/');
  reloadNotificationSubject = new BehaviorSubject<any>('reload');

  constructor() { }

  collapse() {
    this.isOpened = !this.isOpened;
    this.clickBehaviourSubject.next(this.isOpened);
  }

  changeNotificationCount(count: number) {
    this.notificationCountSubject.next(count);
  }

  setRoutes(routes: String) {
    this.changeOfRoutesBehaviourSubject.next(routes);
  }
}
