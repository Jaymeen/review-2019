import { constant } from './../../../app.const';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SessionTemplateMappingService } from '../../services/session-template-mapping.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserIdleService } from 'angular-user-idle';
import { LazyLoadEvent } from 'primeng/api';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Paginator } from 'primeng/paginator';
import { debounceTime } from 'rxjs/operators';
import { ToasterService } from 'src/app/shared/services/toaster.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-admindashboard',
  templateUrl: './admindashboard.component.html',
  styleUrls: ['./admindashboard.component.scss']
})
export class AdmindashboardComponent implements OnInit {

  @ViewChild('paginator') paginator: Paginator;
  mappings: any = []; //to store the mapping data
  totalMappingsDataSubscription: Subscription;  // Subscription for mapping data

  private subscription: Subscription;
  SessionStatusTabIndex: number = constant.STARTINGINDEX;
  pageIndex = 0;
  firstTimeTotalRecords1: number = 0;
  firstTimeTotalRecords2: number = 0;
  totalRecords: number;
  first: number;
  rowPerPage: number;    //maximum number of rows to be displayed every time
  listMappingsForm: FormGroup;
  public rows: any[];
  public statuses: any[];
  order = -1;
  sortAttribute = "session";
  toolTipMaxLength: number;
  //Table Headers
  cols = [
    { field: 'session', header: 'Sessions' },
    { field: 'reviewer', header: 'Reviewer' },
    { field: 'reviewee', header: 'Reviewee' },
    { field: 'status', header: 'Status' }
  ];

  constructor(private sessionTemplateMappingService: SessionTemplateMappingService,
    private router: Router, private userIdle: UserIdleService,
    public toster: ToasterService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService) {
    this.first = 0;
    this.rowPerPage = constant.PAGESIZE;
    this.listMappingsForm = this.formBuilder.group({
      recordsPerPage: constant.ROWS[0],
      selectedStatus: constant.SESSIONMAPPINGSTATUS[0],
      searchString: [''],
    });
    this.rows = constant.ROWS;
    this.statuses = constant.SESSIONMAPPINGSTATUS;
  }

  ngOnInit() {
    this.onFormGroupValueChange();
    //Start the timer once user loggs-in
    this.userIdle.startWatching();

    // Start watching when user idle is starting.
    this.userIdle.onTimerStart().subscribe();

    // Start watch when time is up.
    this.userIdle.onTimeout().subscribe(() => {
      // Log-out user when time is up!:
      this.socialSignOut();
    });
  }

  get searchStringValue() {
    return this.listMappingsForm.get('searchString').value;
  }

  get getRowValue() {
    return parseInt(this.listMappingsForm.get('recordsPerPage').value.value);
  }

  get getStatusValue() {
    return this.listMappingsForm.get('selectedStatus').value.value;
  }

  onFormGroupValueChange() {
    this.listMappingsForm.get('recordsPerPage').valueChanges.subscribe(val => {
      this.rowPerPage = val.value;
      this.paginator.changePage(0);
    });
    this.listMappingsForm.get('selectedStatus').valueChanges.subscribe(val => {
      this.paginator.changePage(0);
    });
    this.listMappingsForm.get('searchString').valueChanges.pipe(debounceTime(constant.DEBOUNCETIME),
    ).
      subscribe(val => {
        if (this.listMappingsForm.get('searchString').valid) {
          this.getSearchString();
        }
      });
  }

  // There 4 methods are for Idle user logout feature, DO NOT RENAME IT.
  stop() {
    this.userIdle.stopTimer();
  }

  stopWatching() {
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

  loadMappings(pagesize: number, pageindex: number, search: string, status: string, sortAttribute: string, order: any, SessionStatusTabIndex: number) {
    this.totalMappingsDataSubscription = this.sessionTemplateMappingService.getMappings(pagesize, pageindex, search, status, sortAttribute, order, SessionStatusTabIndex).subscribe(
      data => {
        if (SessionStatusTabIndex === 1) {
          this.firstTimeTotalRecords1 = this.firstTimeTotalRecords1 === 0 ? data[0] : this.firstTimeTotalRecords1;
        }
        else {
          this.firstTimeTotalRecords2 = this.firstTimeTotalRecords2 === 0 ? data[0] : this.firstTimeTotalRecords2;
        }

        this.totalRecords = data[0];
        this.mappings = data[1];
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
        let errorMessage;
        if (error.error.code === 'SEARCHFALSE') {
          errorMessage = error.error.error;
        }
        else {
          errorMessage = 'No candidates mapping found!'
        }
        this.toster.showError('Error', errorMessage);
      }
    );
  }

  getSearchString() {
    this.paginator.changePage(0);
  }

  viewResponse($event, mapping) {
    if (mapping.status === constant.SESSIONMAPPINGSTATUS[2].value || mapping.status === constant.SESSIONMAPPINGSTATUS[3].value) {
      this.router.navigate(['/response', mapping.session_template_mapping_id]);
    }

  }

  // called every time when admin navigates to new page
  paginate(event) {
    this.pageIndex = event.page;
    this.loadMappings(this.rowPerPage, this.pageIndex + 1, this.searchStringValue, this.getStatusValue, this.sortAttribute, this.order, this.SessionStatusTabIndex);
  }

  customSort(event: LazyLoadEvent) {
    this.order = event.sortOrder ? event.sortOrder : this.order;
    this.sortAttribute = event.sortField ? event.sortField : this.sortAttribute;
    this.loadMappings(this.rowPerPage, this.pageIndex + 1, this.searchStringValue, this.getStatusValue, this.sortAttribute, this.order, this.SessionStatusTabIndex);
  }

  handleChange(event) {
    this.SessionStatusTabIndex = event ? event.index + 1 : 1;
    this.paginator.changePage(0);
  }

  ngOnDestroy() {
    if (this.totalMappingsDataSubscription)
      this.totalMappingsDataSubscription.unsubscribe();
  }
}