import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { constant } from 'src/app/app.const';
import { RevieweeListService } from './../../services/reviewee-list.service';
import { UserIdleService } from 'angular-user-idle';
import { EncryptionService } from './../../../shared/services/encryption.service';
import { Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { debounceTime } from 'rxjs/operators';
import { ToasterService } from './../../../shared/services/toaster.service';
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit {

  @ViewChild('paginator') paginator: Paginator;

  filterOptionsGroup: FormGroup;
  userStatusTabIndex: number = constant.STARTINGINDEX;
  firstTimeTotalRecords1: number = 0;
  firstTimeTotalRecords2: number = 0;
  pageIndex = 0;
  sortOrder = constant.DEFAULTSORTORDER;
  pageSize: number;
  sortAttribute;
  tableData: any[];
  tableData1: any[];
  totalRecords: number;
  userId: number;
  role: string;
  totalUserDataSubscription: Subscription;
  public rowsPerPageOptions: any[];
  public statusOptions: any[];
  toolTipMaxLength: number;
  columns = [
    { field: 'name', header: 'Name' },
    { field: 'session_name', header: 'Session' },
    { field: 'template_name', header: 'Template' },
    { field: 'status', header: 'Status' },
    { field: 'deadline', header: 'Deadline' }
  ];

  columnsOfMyReview = [
    { field: 'name', header: 'Name' },
    { field: 'session_name', header: 'Session' },
    { field: 'template_name', header: 'Template' },
    { field: 'status', header: 'Status' },
  ];


  constructor(private formBuilder: FormBuilder,
    private revieweeListService: RevieweeListService,
    private encryptionService: EncryptionService,
    private userIdle: UserIdleService,
    private router: Router,
    public toast: ToasterService,
    private spinner: NgxSpinnerService
  ) {
    let userdata = JSON.parse(localStorage.getItem('userdata'));
    if(!userdata){
      localStorage.clear();
      window.location.href = '/';
    }
    this.userId = Number(this.encryptionService.get(constant.ENCRYPTIONKEY, userdata.user_id));
    this.role = this.encryptionService.get(constant.ENCRYPTIONKEY, userdata.role);
    this.pageSize = constant.PAGESIZE;
    this.filterOptionsGroup = this.formBuilder.group({
      recordsPerPage: [constant.ROWS[0]],
      selectedStatus: [{ value: constant.DEFAULTSELECTEDSTATUS }],
      searchString: [''],
    });
    this.rowsPerPageOptions = constant.ROWS;
    this.statusOptions = constant.SESSIONMAPPINGSTATUS;
  }

  ngOnInit() {
    this.sortAttribute = this.columns[4].field;
    this.onFormGroupValueChange();
    this.userIdle.startWatching();
    this.userIdle.onTimerStart().subscribe();
    this.userIdle.onTimeout().subscribe(() => {
      this.socialSignOut();
    });
  }

  loadTableData(userId: number,
    pageSize: number,
    pageIndex: number,
    search: string,
    status: string,
    sortAttribute: string,
    sortOrder: number,
    userStatusTabIndex: number) {

    if (userStatusTabIndex === 1) {
      this.totalUserDataSubscription = this.revieweeListService.getRevieweeList(userId, pageSize, pageIndex, search, status, sortAttribute, sortOrder)
        .subscribe(data => {
          this.firstTimeTotalRecords1 = this.firstTimeTotalRecords1 === 0 ? data[0] : this.firstTimeTotalRecords1;
          this.totalRecords = data[0];
          this.tableData = data[1];
          this.spinner.hide();
        }, error => {
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

    } else if (userStatusTabIndex === 2) {
      this.sortAttribute = !this.sortAttribute ? '' : this.sortAttribute;
      this.totalUserDataSubscription = this.revieweeListService.getReviewerList(userId, pageSize, pageIndex, search, status, sortAttribute, sortOrder)
        .subscribe(data => {
          this.firstTimeTotalRecords2 = this.firstTimeTotalRecords2 === 0 ? data[0] : this.firstTimeTotalRecords2;
          this.totalRecords = data[0];
          this.tableData1 = data[1];
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
          }
        );
    }
  }

  get searchStringValue() {
    return this.filterOptionsGroup.get('searchString').value;
  }

  get statusValue() {
    return this.filterOptionsGroup.get('selectedStatus').value.value;
  }

  onFormGroupValueChange() {

    this.filterOptionsGroup.get('recordsPerPage').valueChanges.subscribe(newvalue => {
      this.pageSize = newvalue.value;
      this.paginator.changePage(0);
    });

    this.filterOptionsGroup.get('selectedStatus').valueChanges.subscribe(newvalue => {
      this.paginator.changePage(0);
    });

    this.filterOptionsGroup.get('searchString').valueChanges.pipe(debounceTime(constant.DEBOUNCETIME)).subscribe(newvalue => {
      if (this.filterOptionsGroup.get('searchString').valid) {
        this.getSearchString();
      }
    });

  }
  getSearchString(): any {
    this.paginator.changePage(0);
  }

  viewReview(data) {
    if (this.userStatusTabIndex === 1) {
      if (data.status === constant.SESSIONMAPPINGSTATUS[2].value || data.status === constant.SESSIONMAPPINGSTATUS[3].value) {
        this.router.navigate(['/myreview', data.session_template_mapping_id]);
      }
    }
    else {
      if (data.status === constant.SESSIONMAPPINGSTATUS[3].value) {
        this.router.navigate(['/myreview', data.session_template_mapping_id]);
      }
    }

  }

  giveReview(data) {
    if (data.status === constant.SESSIONMAPPINGSTATUS[1].value || data.status === constant.SESSIONMAPPINGSTATUS[2].value) {

      let session_template_mapping_id = data.session_template_mapping_id;
      this.router.navigate(['/review', session_template_mapping_id]);
    }
  }

  paginate(event) {
    this.pageIndex = event.page;
    this.loadTableData(this.userId, this.pageSize, this.pageIndex + 1, this.searchStringValue, this.statusValue, this.sortAttribute, this.sortOrder, this.userStatusTabIndex);
  }

  customSort(event: LazyLoadEvent) {
    this.sortOrder = event.sortOrder ? event.sortOrder : this.sortOrder;
    this.sortAttribute = event.sortField ? event.sortField : this.sortAttribute;
    this.loadTableData(this.userId, this.pageSize, this.pageIndex + 1, this.searchStringValue, this.statusValue, this.sortAttribute, this.sortOrder, this.userStatusTabIndex);
  }

  stop() {
    this.userIdle.stopTimer();
  }

  stopptching() {
    this.userIdle.stopWatching();
  }

  startWatching() {
    this.userIdle.startWatching();
  }

  restart() {
    this.userIdle.resetTimer();
  }

  public socialSignOut() {
    localStorage.clear();
    this.router.navigate(['sessionexpire']);
  }

  handleChange(event) {
    this.userStatusTabIndex = event ? event.index + 1 : 1;
    this.paginator.changePage(0);
  }
}