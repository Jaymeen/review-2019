import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NotificationsService } from '../../services/notifications.service';
import { BaseService } from './../../services/base.service';
import { EncryptionService } from 'src/app/shared/services/encryption.service';
import { constant } from './../../../app.const';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToasterService } from 'src/app/shared/services/toaster.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { LivenotificationService } from '../../services/livenotification.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  checkBoxGroup: FormGroup;
  notificationTotalCount;
  notificationUnreadCount = 0;
  checkall = false;
  notificationData: any;
  notificationHeader: string;
  notificationMessage: string;
  userId: number;
  readDeleteIndex = -1;
  modalRef: BsModalRef;
  notificationSubscription: any;

  constructor(private formBuilder: FormBuilder,
    private baseService: BaseService,
    private encryptionService: EncryptionService,
    private router: Router,
    private notificationService: NotificationsService,
    private spinner: NgxSpinnerService,
    public toast: ToasterService,
    private modalService: BsModalService,
    public livenotification: LivenotificationService) {
    this.checkBoxGroup = this.formBuilder.group({
      checkBox: [false]
    });
  }

  ngOnInit() {
    this.router.onSameUrlNavigation = "reload";
    const userData = localStorage.getItem('userdata');
    this.userId = this.encryptionService.get(constant.ENCRYPTIONKEY, JSON.parse(userData).user_id);
    this.loadAllNotificationsData();
    this.notificationSubscription = this.livenotification
      .callNotificationApi()
      .subscribe((message: string) => {
        this.loadAllNotificationsData(true);
        
      });
  }

  readAllConfirmation(template: TemplateRef<any>) {
    this.checkBoxGroup.get('checkBox').setValue(false);
    this.modalRef = this.modalService.show(template);
  }


  markAllAsRead() {
    this.modalRef.hide();

    for (let i = 0; i < this.notificationData.length; i++) {
      if (!this.notificationData[i].isSeen) {
        this.notificationData[i].isSeen = true;
      }
    }
    this.checkBoxGroup.get('checkBox').setValue(true);
    this.checkBoxGroup.disable();
    this.checkall = true;
    this.baseService.changeNotificationCount(0);
    this.notificationUnreadCount = 0;
    this.notificationService.markAllAsRead(this.userId).subscribe();
  }

  loadAllNotificationsData(hideSpinner?) {
    this.notificationService.getAllNotifications(this.userId, hideSpinner ? hideSpinner : false).subscribe(data => {
      this.notificationTotalCount = data[0];
      this.notificationUnreadCount = data[1];
      this.notificationData = data[2];
      if (this.notificationUnreadCount == 0) {
        this.checkBoxGroup.get('checkBox').setValue(true);
        this.checkBoxGroup.disable();
      }
      else{
          this.checkBoxGroup.get('checkBox').setValue(false);
          this.checkBoxGroup.enable();
      }
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
      this.toast.showError('Error', 'Error fetching notifications');
    }
    );
  }

  deleteNotification(notificationId: number, index: number, notificationIsSeen: boolean) {
    if (notificationIsSeen === false) {
      this.baseService.changeNotificationCount(-1);
      this.notificationUnreadCount -= 1;
      if (this.notificationUnreadCount == 0) {
        this.checkBoxGroup.get('checkBox').setValue(true);
        this.checkBoxGroup.disable();
      }
    }

    this.notificationTotalCount -= 1;
    this.notificationService.deleteOneNotification(notificationId).subscribe(data => {
      this.notificationData.splice(index, 1);
    }, error => {
    });
  }

  markAsRead(notificationId: number, index: number) {
    if (!this.checkall) {
      if (!this.notificationData[index].isSeen) {
        this.notificationData[index].isSeen = true;
        this.baseService.changeNotificationCount(-1);
      }
      this.notificationService.markOneAsRead(notificationId).subscribe(data => {
        this.notificationUnreadCount -= 1;
        if (this.notificationUnreadCount == 0) {
          this.checkBoxGroup.get('checkBox').setValue(true);
          this.checkBoxGroup.disable();
        }
      }, error => {
      });
    }

  }

  redirectToPage(referenceLink, notificationId: number, index: number) {
    this.markAsRead(notificationId, index);
    this.router.navigate([referenceLink]);
  }

  decline(): void {
    this.modalRef.hide();
  }

  ngOnDestroy() {
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
  }
}
