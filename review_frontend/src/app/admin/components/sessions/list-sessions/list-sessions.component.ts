import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { constant } from './../../../../app.const';
import { Component, OnInit, OnChanges, ViewChild, TemplateRef } from '@angular/core';
import { SessionsService } from '../../../services/sessions.service';
import { Router } from '@angular/router';
import { Subscription, pipe } from 'rxjs';
import { ToasterService } from 'src/app/shared/services/toaster.service';
import { MessageService, LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { debounceTime } from 'rxjs/operators';
import { EncryptionService } from 'src/app/shared/services/encryption.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { LivenotificationService } from 'src/app/base/services/livenotification.service';

interface Rows {
  value: number;
}
interface Statues {
  value: string;
}
@Component({
  selector: 'app-list-sessions',
  templateUrl: './list-sessions.component.html',
  styleUrls: ['./list-sessions.component.scss']
})
export class ListSessionsComponent implements OnInit {

  @ViewChild('paginator') paginator: Paginator;
  first = 0;
  rowPerPage: number;                                    // maximum number of rows to be displayed every time
  firstTimeTotalRecords: number = 0;
  sessions: any = [];                              // to store the session data
  totalSessionDatadataSubscription: Subscription;  // dataSubscription for session data
  pageIndex = 0;
  totalRecords: number;                         // for paginator to display the page links
  deleteSessionName: string;
  deleteSessionId: number;
  listSessionForm: FormGroup;
  public rows: Rows[];
  public statuses: Statues[];
  order: any = -1;
  sortAttribute: string;
  page: boolean;
  columns = [
    { field: 'session_name', header: 'Name' },
    //{ field: 'review_cycle_frequency', header: 'Frequency' },
    { field: 'session_description', header: 'Description' },
    { field: 'session_status', header: 'Status' },
    { field: 'session_starting_date', header: 'Starting On' },
    { field: 'session_ending_date', header: 'Ending On' },
    { field: 'session_created_at', header: 'Created At', order: -1 }
  ];
  userId: number;
  modalRef: BsModalRef;

  constructor(private sessionsService: SessionsService,
    private router: Router, public toast: ToasterService,
    private encryptionService: EncryptionService,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private modalService: BsModalService,
    private liveNotification: LivenotificationService) {
      
    this.first = 0;
    this.rowPerPage = constant.PAGESIZE;
    let userData = JSON.parse(localStorage.getItem('userdata'));
    this.userId = Number(this.encryptionService.get(constant.ENCRYPTIONKEY, userData.user_id));
    // form group
    this.listSessionForm = this.formBuilder.group({
      recordsPerPage: constant.ROWS[0],
      selectedStatus: constant.SESSIONSTATUS[0],
      searchString: [''],
    });
    this.rows = constant.ROWS;
    this.statuses = constant.SESSIONSTATUS;
    this.order = -1;
    this.sortAttribute = "session_name";
  }

  ngOnInit() {
    this.onFormFieldValueChange();

  }
  get searchStringValue() {
    return this.listSessionForm.get('searchString').value;
  }

  get getRowValue() {
    return parseInt(this.listSessionForm.get('recordsPerPage').value.value);
  }
  get getStatusValue() {
    return this.listSessionForm.get('selectedStatus').value.value;
  }

  onFormFieldValueChange() {
    this.listSessionForm.get('recordsPerPage').valueChanges.subscribe(val => {
      this.rowPerPage = val.value;
      this.paginator.changePage(0);
    });
    this.listSessionForm.get('selectedStatus').valueChanges.subscribe(val => {
      this.paginator.changePage(0);
    });

    this.listSessionForm.get('searchString').valueChanges.pipe(debounceTime(constant.DEBOUNCETIME),
    ).
      subscribe(val => {
        if (this.listSessionForm.get('searchString').valid) {
          this.getSearchString();
        }
      });
  }

  //retrive rows according to the page number and offset  
  loadSession(pagesize: number, pageindex: number, search: string, status: string, sort_attribute: string, order: any) {
    this.totalSessionDatadataSubscription = this.sessionsService.getSessions(pagesize, pageindex, search, status, sort_attribute, order).subscribe(
      data => {
        this.firstTimeTotalRecords = this.firstTimeTotalRecords === 0 ? data[0] : this.firstTimeTotalRecords;
        this.totalRecords = data[0];
        this.sessions = data[1];
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
        let errorMessage;
        if (error.error.code === 'SEARCHFALSE') {
          errorMessage = error.error.error;
        }
        else {
          errorMessage = 'Error in  records!'
        }
        this.toast.showError('Error', errorMessage);
      });
  }

  // get search string value and pass it to the service
  getSearchString() {
    this.paginator.changePage(0);
  }

  // called every time when admin navigates to new page
  paginate(event) {
    this.pageIndex = event.page;
    this.loadSession(this.rowPerPage,
      this.pageIndex + constant.STARTINGINDEX,
      this.searchStringValue,
      this.getStatusValue,
      this.sortAttribute,
      this.order);
  }

  //lazy loading method
  customSort(event: LazyLoadEvent) {
    this.order = event.sortOrder ? event.sortOrder : this.order;
    this.sortAttribute = event.sortField ? event.sortField : this.sortAttribute;
    this.loadSession(this.rowPerPage,
      this.pageIndex + constant.STARTINGINDEX,
      this.searchStringValue,
      this.getStatusValue,
      this.sortAttribute,
      this.order);
  }

  // delete only if the session is closed
  deleteSession() {
    this.modalRef.hide();
    this.sessionsService.deleteSession(this.deleteSessionId, this.userId).subscribe(
      x => {
        this.toast.showInfo('Info', 'Session Deleted');
        this.paginator.changePage(0);
        this.spinner.hide();
        this.liveNotification.sendMessage();
      },
      error => {
        this.spinner.hide();
        this.toast.showError('Error', 'Session could not be deleted');
      }
    );
  }

  //navigate to the create session page
  addSession() {
    this.router.navigate(['session-details']);
  }

  // unsubscribe the observables
  ngOnDestroy() {
    if (this.totalSessionDatadataSubscription)
      this.totalSessionDatadataSubscription.unsubscribe();
  }

  //when admin click on delete icon it will check the status of session
  deleteForSession(session,template: TemplateRef<any>) {
    if (session.session_status === 'inactive') {
      this.deleteSessionName = session.session_name;
      this.deleteSessionId = session.session_id;
      this.modalRef = this.modalService.show(template);
    }
  }

  //when admin click on update icon it will check the status of session
  // navigate to the create page along with session id
  updateForSession(session) {
    if (session.session_status === 'active') {
      this.router.navigate(['session-details', session.session_id]);
    }
  }

  showForSession(session) {
    this.router.navigate(['session-mapping-details', session.session_id]);
  }

  decline(): void {
    this.modalRef.hide();
  }
}