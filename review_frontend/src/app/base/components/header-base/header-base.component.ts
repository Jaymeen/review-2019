import { BaseService } from './../../services/base.service';
import { Component, Input, OnInit, Output, EventEmitter, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationsService } from '../../services/notifications.service';
import { EncryptionService } from 'src/app/shared/services/encryption.service';
import { constant } from 'src/app/app.const';
import { Subscription } from 'rxjs';
import { ToasterService } from 'src/app/shared/services/toaster.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { LivenotificationService } from '../../services/livenotification.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header-base',
  templateUrl: './header-base.component.html',
  styleUrls: ['./header-base.component.scss']
})
export class HeaderBaseComponent implements OnInit {
  @Input() show;
  @Output() changeWidth: EventEmitter<any> = new EventEmitter<any>();
  componentOpen = false;
  subscription: Subscription;
  readAll = false;
  notificationSubscription: any;
  modalRef: BsModalRef;

  constructor(private baseService: BaseService, private _router: Router,
    public encryptionService: EncryptionService,
    private notificationsService: NotificationsService,
    public toast: ToasterService,
    private modalService: BsModalService,
    public livenotification: LivenotificationService) { }

  public role;
  userId: number;
  notificationData: any;
  notificationUnreadCount: number;
  notificationTotalCount: number;

  public socialSignOut() {
    localStorage.clear();
    window.location.href = '/login';
  }
  ngOnInit() {
    let userData = JSON.parse(localStorage.getItem('userdata'));
    this.role = this.encryptionService.get(constant.ENCRYPTIONKEY, userData.role);
    this.userId = this.encryptionService.get(constant.ENCRYPTIONKEY, userData.user_id);
    this.getNotificationData();
    this.setNotificationCount();
    this.notificationSubscription = this.livenotification
      .callNotificationApi()
      .subscribe((message: string) => {
        this.refreshData();
      }
      );
  }

  refreshData() {
    this.getNotificationData();
  }

  getNotificationData() {
    this.notificationsService.getLatestTenNotifications(this.userId).subscribe(data => {
      this.notificationTotalCount = data[0];
      this.notificationUnreadCount = data[1];
      if (this.notificationUnreadCount == 0) { this.readAll = true; }
      this.notificationData = data[2];
    }, error => {
      this.toast.showError('Error', 'Error fetching new notifications');
    }
    );
  }

  onClick() {
    this.baseService.collapse();
  }

  setNotificationCount() {
    this.subscription = this.baseService.notificationCountSubject.subscribe(data => {
      if (data === 0) {
        this.notificationUnreadCount = 0;
      } else if (data === -1) {
        this.notificationUnreadCount -= 1;
      }
    });
  }

  homeredirect() {
    if (this.role === 'ROLE_SADMIN') {
      this._router.navigate(['/admindashboard']);
    } else {
      this._router.navigate(['/dashboard']);
    }
  }

  markAllAsRead() {
    this.modalRef.hide();

    for (let i = 0; i < this.notificationData.length; i++) {
      if (!this.notificationData[i].isSeen) {
        this.notificationData[i].isSeen = true;
      }
    }

    this.baseService.changeNotificationCount(0);
    this.notificationUnreadCount = 0;
    this.notificationsService.markAllAsRead(this.userId).subscribe(data => {
    }, error => {
    });
  }

  markAsRead(referenceLink: string, notificationId: number, index: number) {
    if (!this.notificationData[index].isSeen) {
      this.notificationData[index].isSeen = true;
      this.baseService.changeNotificationCount(-1);
      this.notificationsService.markOneAsRead(notificationId).subscribe(data => {
      }, error => {
      });
    }

    if (this._router.url.split('/')[1] === referenceLink.split('/')[1]) {
      window.location.href = referenceLink;
    }
    else {
      this._router.navigate([referenceLink]);
    }
  }

  navigateToNotifications() {
    if (this._router.url === '/notifications') {
      window.location.reload();
    }
    else {
      this._router.navigate(['/notifications']);
    }
  }

  openModal(template: TemplateRef<any>) {
    if (this.notificationUnreadCount > 0) {
      this.modalRef = this.modalService.show(template);
    }
  }

  decline(): void {
    this.modalRef.hide();
  }

  ngOnDestroy() {
    if(this.notificationSubscription){
    this.notificationSubscription.unsubscribe();

    }
  }
}