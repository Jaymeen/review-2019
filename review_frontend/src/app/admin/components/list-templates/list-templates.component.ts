import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscriber } from './../../../../../types/rxjs.d';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { TemplateService } from '../../services/template.service';
import { Router } from '@angular/router';
import { ToasterService } from '../../../shared/services/toaster.service'
import { Subscription } from 'rxjs';
import { Paginator } from 'primeng/paginator';
import { LazyLoadEvent } from 'primeng/api';
import { constant } from 'src/app/app.const';
import { debounceTime } from 'rxjs/operators';
import { EncryptionService } from 'src/app/shared/services/encryption.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { LivenotificationService } from 'src/app/base/services/livenotification.service';

interface Rows {
  value: number;
}

interface Status {
  value: string;
}

@Component({
  selector: 'app-list-templates',
  templateUrl: './list-templates.component.html',
  styleUrls: ['./list-templates.component.scss']
})


export class ListTemplatesComponent implements OnInit {

  totalTemplateDataSubscription: Subscription;

  @ViewChild('paginator') paginator: Paginator;
  results: any[];
  deleteId = 0;
  firstTimeTotalRecords: number = 0;
  deleteTemplateName: string = "";
  first = 0;
  rowPerPage: number;
  sessions: any = [];
  totalRecords: number;
  deleteSessionName: string;
  deleteSessionId: number;
  listSessionForm: FormGroup;
  public rows: Rows[];
  public status: Status[];
  page: boolean;
  pageIndex = 0;
  sortfield = "creation_date";
  sortorder = constant.DEFAULTSORTORDER;
  listTemplateForm: FormGroup;
  userId: number;
  modalRef: BsModalRef;

  cols = [
    { field: 'template_name', header: 'Name' },
    { field: 'creation_date', header: 'Date Created' },
    { field: 'template_description', header: 'Description' }
  ];


  constructor(private templateService: TemplateService,
    private _router: Router,
    private toaster: ToasterService,
    private encryptionService: EncryptionService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private modalService: BsModalService,
    private liveNotification: LivenotificationService) {


    this.first = 0;
    this.rowPerPage = constant.PAGESIZE;
    this.sortorder = -1;
    this.rows = constant.ROWS;
    this.sortfield = "creation_date";

    let userData = JSON.parse(localStorage.getItem('userdata'));
    this.userId = Number(this.encryptionService.get(constant.ENCRYPTIONKEY, userData.user_id));
    this.listTemplateForm = this.formBuilder.group({
      recordsPerPage: constant.ROWS[0],
      selectedStatus: constant.TEMPLATESTATUS[0],
      searchString: [''],
    });
    this.rows = constant.ROWS;
    this.status = constant.TEMPLATESTATUS;
  }

  ngOnInit() {
    this.results = [];
    this.onFormFieldValueChange();
  }

  get getRowValue() {
    return parseInt(this.listTemplateForm.get('recordsPerPage').value.value);
  }

  get searchStringValue() {
    return this.listTemplateForm.get('searchString').value;
  }

  get getStatusValue() {
    return this.listTemplateForm.get('selectedStatus').value.value;
  }

  onFormFieldValueChange() {
    this.listTemplateForm.get('recordsPerPage').valueChanges.subscribe(val => {
      this.rowPerPage = val.value;
      this.paginator.changePage(0);
    });

    this.listTemplateForm.get('selectedStatus').valueChanges.subscribe(val => {
      this.paginator.changePage(0);
    });

    this.listTemplateForm.get('searchString').valueChanges.pipe(debounceTime(constant.DEBOUNCETIME),
    ).
      subscribe(val => {
        if (this.listTemplateForm.get('searchString').valid) {
          this.getSearchString();
        }
      });
  }

  newtemplate() {
    this._router.navigate(['template']);
  }

  deleteRequest(index: number) {
    this.modalRef.hide();
    this.templateService.deleteTemplate(index, this.userId).subscribe((data) => {
      this.spinner.hide();
      if (!data) { this.toaster.showError('Error', 'We are not able to complete your request, please try again later'); }
      let message = Object.keys(data)[0];
      if (message === 'message') {
        this.toaster.showSuccess('Success', 'Template deleted successfully');
        this.paginator.changePage(0);
      }
      else {
        this.toaster.showError('Error', data.error);
      }
      this.liveNotification.sendMessage();
    });
    this.deleteId = 0;
  }

  setDeleteId(eachdata, template: TemplateRef<any>) {
    if (eachdata.template_status === 'used') {
      this.deleteId = 0;
    }
    else {
      this.deleteId = eachdata.template_id;
      this.deleteTemplateName = this.results[this.results.findIndex(data => data.template_id === this.deleteId)].template_name;
     
    }
    this.modalRef = this.modalService.show(template);
  }

  setPreviewId(templateId: number) {
    this._router.navigate(['preview', templateId],{ queryParams: { origin: 'list' } });
  }

  cloneTemplate(templateIdToClone) {
    this._router.navigate(['cloneTemplate', templateIdToClone]);
  }

  customSort(event: LazyLoadEvent) {
    this.sortfield = event.sortField ? event.sortField : this.sortfield;
    this.sortorder = event.sortOrder ? event.sortOrder : this.sortorder;
    this.loadTemplates(this.rowPerPage, this.pageIndex + constant.STARTINGINDEX, this.searchStringValue, this.getStatusValue, this.sortfield, this.sortorder);
  }

  getSearchString() {
    this.paginator.changePage(0);
  }

  loadTemplates(pagesize: number, pageindex: number, search_string: string, status: string, sortfield: string, order: number) {
    this.totalTemplateDataSubscription = this.templateService.getTemplates(pagesize, pageindex, search_string, status, sortfield, order, this.userId).subscribe(
      data => {
        this.firstTimeTotalRecords = this.firstTimeTotalRecords === 0 ? data[0] : this.firstTimeTotalRecords;
        this.totalRecords = data[0];
        this.results = data[1];
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
        let errorMessage;
        if (error.error.code === 'SEARCHFALSE') {
          errorMessage = error.error.error;
        }
        else {
          errorMessage = 'Error in Fetching Records !'
        }
        this.toaster.showError('Error', errorMessage);
      }
    );
  }

  paginate(event) {
    this.pageIndex = event.page;
    this.loadTemplates(this.rowPerPage, this.pageIndex + constant.STARTINGINDEX, this.searchStringValue, this.getStatusValue, this.sortfield, this.sortorder);
  }

  updateTemplate(template) {
    if (template.template_status !== 'used') {
      this._router.navigate(['editTemplate', template.template_id]);
    }
  }

  ngOnDestroy() {
    if (this.totalTemplateDataSubscription)
      this.totalTemplateDataSubscription.unsubscribe();
  }

  decline(): void {
    this.modalRef.hide();
  }
}