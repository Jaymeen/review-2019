import { ToasterService } from './../../../../shared/services/toaster.service';
import { SessionsService } from './../../../services/sessions.service';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormGroup, ValidatorFn } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { constant } from 'src/app/app.const';
import { EncryptionService } from 'src/app/shared/services/encryption.service';
import { CustomValidatorsService } from 'src/app/shared/services/custom-validators.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { LivenotificationService } from 'src/app/base/services/livenotification.service';


interface Cycles {
  label: number;
  value: string;
  days: number;
}
const DurationValidator: ValidatorFn = (fg: FormGroup) => {
  const duration = fg.get('duration').value;
  const cycle = fg.get('cycle').value;
  if (duration !== null && duration < 1)
    return { range: "Duration should be greater than 0" };
  else if (cycle !== null && duration !== null && cycle.days < duration && cycle.days !== 0) {
    if (cycle.value === 'Never')
      return { range: "Duration should be less than 366" };
    else
      return { range: "Duration should be less than review cycle" };
  }
  return null;
};
@Component({
  selector: 'app-session-details',
  templateUrl: './session-details.component.html',
  styleUrls: ['./session-details.component.scss']
})
export class SessionDetailsComponent implements OnInit {
  sessionObj: any;
  public updateId: string;
  public isUpdate: boolean;
  public data;
  public cycle_options: Cycles[];
  today = new Date();
  set_cycle_label;
  dateFormat = constant.DATEFORMAT;
  minDate: Date;
  public userData;
  public user_id;
  count = 0;
  field: any = {};
  form: FormGroup;
  public editable_flag = true;
  public disable_flag = false;
  public duration_flag = false;
  sessionForm: FormGroup;
  btnDisable = false;
  public valid = true;
  maxLengthDescription = constant.MAXLENGTHFORDESCRIPTION;
  maxLengthForName = constant.MAXLENGTHFORNAME;
  modalRef: BsModalRef;

  constructor(
    private service: SessionsService,
    private route: Router,
    private router: ActivatedRoute,
    private fb: FormBuilder,
    public datepipe: DatePipe,
    public toast: ToasterService,
    private customValidatorsService: CustomValidatorsService,
    private encryptedService: EncryptionService,
    private spinner: NgxSpinnerService,
    private modalService: BsModalService,
    private liveNotification: LivenotificationService
  ) {
    this.cycle_options = [
      { label: 12, value: 'Yearly', days: 365 },
      { label: 6, value: 'Half-Yearly', days: 180 },
      { label: 4, value: 'Every 4 months', days: 120 },
      { label: 3, value: 'Every 3 months', days: 90 },
      { label: 2, value: 'Every 2 months', days: 60 },
      { label: 1, value: 'Every month', days: 30 },
      { label: 0, value: 'Never', days: 365 }
    ];
  }
  ngOnInit() {
    this.editData();
    this.sessionForm = this.fb.group(
      {
        name: [
          null,
          [
            Validators.required,
            Validators.pattern(/^[\w @$%*()\-=\[\]{};':",.<>\/?!`~^|][\w @^|!`~$%*()\-=\[\]{};':",.<>\/?]*$/i),
            this.customValidatorsService.textboxValidators(), Validators.maxLength(this.maxLengthForName)
          ],
          this.customValidatorsService.nameValidator("session", Number(this.updateId), this.isUpdate)
        ],
        start_date: [{ value: null, disabled: this.isUpdate }, Validators.required],
        duration: [null, Validators.required],
        description: [null, [Validators.required,
        Validators.pattern(/^[\w! \n@$%&*()+\-=\[\]{};':"\\,.<>\/?]*$/i), this.customValidatorsService.textboxValidators(), Validators.maxLength(this.maxLengthDescription)]],
        cycle: [null, Validators.required],
        arr: [
          this.cycle_options.map(label => {
            return label;
          })
        ]
      },
      { validator: DurationValidator }
    );
    this.userData = JSON.parse(localStorage.getItem('userdata'));
    this.userData.user_id = this.encryptedService.get(
      constant.ENCRYPTIONKEY,
      this.userData.user_id
    );
    this.user_id = this.userData.user_id;
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();
    this.minDate = new Date();
    this.minDate.setMonth(month);
    this.minDate.setFullYear(year);
    this.sessionForm.get('cycle').setValue(null);
  }
  editData() {
    const id = this.router.snapshot.paramMap.get('sessionId');
    this.updateId = id;
    if (this.updateId) {
      this.isUpdate = true;
      this.service
        .getSessionById(this.updateId)
        .subscribe(data => {
          if (data.session_status === 'inactive') {
            this.toast.showInfo('Info', 'Closed session cannot be updated!');
            this.route.navigate(['list-sessions']);
          }
          this.data = data;
          const start_date = new Date(this.data.session_starting_date);
          const end_date = new Date(this.data.session_ending_date);
          const formatstart_date = this.datepipe.transform(
            start_date,
            this.dateFormat
          );
          const duration_difference = Math.abs(end_date.getTime() - start_date.getTime());
          const duration = Math.ceil(duration_difference / (1000 * 3600 * 24));
          this.setValue(data, formatstart_date, duration);
          this.spinner.hide();
        }, error => {
          this.spinner.hide();
          this.toast.showError('Error', 'Session records not found');
          this.route.navigate(['/list-sessions']);
        });
    } else {
      this.isUpdate = false;
    }
  }
  get formControls() {
    return this.sessionForm.controls;
  }
  trimValue(event, field) {
    event.target.value = event.target.value.trim();
    this.sessionForm.controls[field].setValue(event.target.value);
  }
  restrictInput(e: any) {
    let input;
    if (e.metaKey || e.ctrlKey) {
      return true;
    }
    if (e.which === 32) {
      return false;
    }
    if (e.which === 0) {
      return true;
    }
    if (e.which < 33) {
      return true;
    }
    input = String.fromCharCode(e.which);
    return !!/[\d\s]/.test(input);
  }
  setValue(data: any, formatstart_date, duration) {
    this.cycle_options.map(label => {
      if (label.label === this.data.review_cycle_frequency) {
        this.sessionForm.patchValue({
          name: this.data.session_name,
          start_date: formatstart_date,
          duration: duration,
          description: this.data.session_description,
          cycle: label
        });
      }
    });
  }
  getValue() {
    const send_start_date = this.datepipe.transform(
      this.sessionForm.value.start_date,
      this.dateFormat
    );
    const end_date = new Date();
    end_date.setDate(this.sessionForm.value.start_date.getDate() + this.sessionForm.value.duration);
    const send_end_date = this.datepipe.transform(
      end_date,
      this.dateFormat
    );
    let startDate = new Date(this.sessionForm.value.start_date)
    let currentDate = new Date();
    this.sessionObj = {
      session_name: this.sessionForm.value.name,
      session_starting_date: send_start_date,
      session_ending_date: send_end_date,
      session_no_of_days: this.sessionForm.value.duration,
      session_description: this.sessionForm.value.description,
      review_cycle_frequency: this.sessionForm.value.cycle.label,
      session_version: startDate.setHours(0, 0, 0, 0) == currentDate.setHours(0, 0, 0, 0) ? 1 : 0,
      created_by: Number(this.user_id)
    };
  }
  updateValue() {
    const start_date = new Date(this.data.session_starting_date);
    const end_date = new Date();
    end_date.setDate(start_date.getDate() + this.sessionForm.value.duration);
    const send_start_date = this.datepipe.transform(
      this.data.session_starting_date,
      this.dateFormat
    );
    const send_end_date = this.datepipe.transform(
      end_date,
      this.dateFormat
    );
    this.cycle_options.map(label => {
      if (label.value === this.sessionForm.get('cycle').value.value) {
        this.set_cycle_label = label.label;
      }
    });
    this.sessionObj = {
      session_name: this.sessionForm.value.name,
      session_starting_date: send_start_date,
      session_ending_date: send_end_date,
      session_no_of_days: this.sessionForm.value.duration,
      session_description: this.sessionForm.value.description,
      session_version: this.data.version,
      review_cycle_frequency: this.set_cycle_label,
      modified_by: Number(this.user_id)
    };
  }
  navigateToListSessions() {
    if (this.modalRef) {
      this.modalRef.hide();
    }
    this.route.navigate(['/list-sessions']);
  }
  onCancel(template: TemplateRef<any>) {
    if (this.formControls.start_date.value !== null || this.formControls.name.value !== null ||
      this.formControls.cycle.value !== null || this.formControls.duration.value !== null ||
      this.formControls.description.value !== null) {
      this.modalRef = this.modalService.show(template);
    } else {
      this.navigateToListSessions();
    }
  }
  onSubmit(update: boolean) {

    if (this.sessionForm.invalid) {
      Object.keys(this.sessionForm.controls).map(field => {
        const control = this.sessionForm.get(field);
        control.markAsTouched({ onlySelf: true });
        control.markAsDirty({ onlySelf: true });
      });
    } else {
      if (update === false && this.sessionForm.valid) {
        this.getValue();
        this.disable_flag = true;
        this.service.addSession(this.sessionObj).subscribe(
          response => {
            this.toast.showSuccess(
              'Success',
              'Session has been created !'
            );
            this.route.navigate(['/list-sessions']);
            this.spinner.hide();
            this.liveNotification.sendMessage();
          },
          error => {
            this.spinner.hide();
            this.disable_flag = false;
            if (error.error.code === 'SEQFALSEINSERT') {
              this.toast.showInfo('Error', 'Session name already exists');
            } else {
              this.toast.showError('Error', 'Session could not be created');
            }
          }
        );
      } else if (update === true && this.sessionForm.valid) {
        this.updateValue();
        this.disable_flag = true;
        this.service.editSession(this.sessionObj, this.updateId).subscribe(
          response => {
            this.toast.showSuccess(
              'Success',
              'Session has been updated!'
            );
            this.route.navigate(['/list-sessions']);
            this.spinner.hide();
            this.liveNotification.sendMessage();
          },
          error => {
            this.spinner.hide();
            this.disable_flag = false;
            // this is a error code for unique name in backend
            if (error.error.code === 'SEQFALSEINSERT') {
              this.toast.showInfo('Error', 'Session name already exists');
            } else {
              this.toast.showError('Error', 'Session could not be updated');
            }
          }
        );
      }
    }
  }

  decline(): void {
    this.modalRef.hide();
  }
}