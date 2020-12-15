import { constant } from './../../../app.const';
import { EncryptionService } from './../../services/encryption.service';
import { Component, Input, OnInit, Output, EventEmitter, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { TemplateService } from '../../services/template.service';
import { Router } from '@angular/router';
import { CustomValidatorsService } from '../../services/custom-validators.service';
import { ToasterService } from '../../../shared/services/toaster.service'
import { ResponseService } from '../../services/response.service';
import { ReviewsService } from 'src/app/user/services/reviews.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'dynamic-form-builder',
  templateUrl: './dynamic-form-builder.component.html',
  styleUrls: ['./dynamic-form-builder.component.scss'],
})
export class DynamicFormBuilderComponent implements OnInit {
  @Output() onSubmit = new EventEmitter();
  @Input() templateId: any;
  @Input() mappingId: any;
  @Input() readOnly: boolean;
  @Input() isEditable: boolean;
  public fields: any = [];
  public role;
  public reviewer;
  public sessionName;
  public reviewee;
  public canRender = false;
  public responseData: any = {};
  public userId;
  public full_name;
  public componentData;
  public question_array = [];
  response: any[] = [];
  form = null;
  modalRef: BsModalRef;
  disabledButton = false;

  constructor(private templateService: TemplateService,
    public validators: CustomValidatorsService, public route: Router,
    private toaster: ToasterService, public encryptionService: EncryptionService,
    private responseService: ResponseService,
    private reviewService: ReviewsService,
    private spinner: NgxSpinnerService,
    private modalService: BsModalService) {
  }
  ngOnInit() {
    let userData = JSON.parse(localStorage.getItem('userdata'));
    this.full_name = this.encryptionService.get(constant.ENCRYPTIONKEY, userData.full_name);
    this.userId = Number(this.encryptionService.get(constant.ENCRYPTIONKEY, userData.user_id));
    this.role = this.encryptionService.get(constant.ENCRYPTIONKEY, userData.role);
    this.form = new FormGroup({});
    if (this.isEditable === true) {
      this.loadresponseData(this.mappingId);
    } else {
      this.loadData(this.templateId);
    }
  }
  loadresponseData(mappingId) {
    this.responseService.getResponse(mappingId).subscribe(
      data => {
        this.responseData = data.response[0];
        this.loadData(this.templateId);
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
        if (error.error.code === 'NORECORD') {
          this.toaster.showError('Error', 'No response data found for this record');
          if (this.role === 'ROLE_SADMIN') {
            if (this.route.url.includes('response')) {
              this.route.navigate(['admindashboard']);
            }
            else {
              this.route.navigate(['givereview']);
            }
          }
          else {
            this.route.navigate(['dashboard']);
          }
        }
      }
    );
  }
  cancelCall() {
    this.modalRef.hide();

    if (this.isEditable) {
      this.onSubmit.emit(false);
    } else {
      if (this.role === 'ROLE_SADMIN') {
        this.route.navigate(['/givereview']);
      } else {
        this.route.navigate(['/dashboard']);
      }
    }
  }
  submit() {
    this.disabledButton = true;
    this.markFormGroupTouched(this.form);
    if (this.form.valid) {
      if (this.isEditable) {
        this.onUpdate(this.form.value);
      } else {
        this.onSubmit.emit(this.form.value);
      }
    }
    else {
      this.disabledButton = false;
    }
  }
  onUpdate(review: any) {
    let responseObj = Object.assign({
      user_id: this.userId,
      user_name: this.full_name,
      session_template_mapping_id: this.mappingId,
      answer_response: [review],
      old_data: [this.responseData],
      question_response: this.question_array
    });
    this.reviewService.updateReview(responseObj, this.mappingId).subscribe(
      response => {
        this.toaster.showSuccess(
          'Success',
          'Response has been updated!'
        );
        this.spinner.hide();
        this.onSubmit.emit(false);
      },
      error => {
        this.spinner.hide();
      });
  }
  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }
  loadFormComponents() {
    let fieldsCtrls = {};
    for (let field of this.fields) {
      if (field.type == 'checkbox') {
        let labels = {};
        for (let label of field.labels) {
          labels[label] = new FormControl(false);
        }
        fieldsCtrls[field.name] = new FormGroup(labels, this.validators.oneCheckboxSelection());
      } else if (field.type == 'text') {
        fieldsCtrls[field.name] = new FormControl('', [Validators.required, Validators.maxLength(400)])
      } else if (field.type == 'rating') {
        fieldsCtrls[field.name] = new FormControl('', [Validators.required])
      } else {
        fieldsCtrls[field.name] = new FormControl('', Validators.required)
      }
    }
    this.form = new FormGroup(fieldsCtrls);
    if (this.isEditable) {
      Object.keys(this.form.controls).forEach(key => {
        this.form.controls[key].patchValue(this.responseData[key]);
      });
    }
  }
  loadData(template_id) {
    this.templateService.getTemplate(template_id).subscribe(
      data => {
        data.templateStructure.map(questions => {
          let questionKey = Object.keys(questions)[0];
          let componentData = Object.values(questions)[0];
          this.question_array.push(componentData['question']);
          let str = componentData['type'];
          switch (str) {
            case 'radio': this.renderRadioComponent(componentData, questionKey);
              break;
            case 'text': this.renderTextComponent(componentData, questionKey);
              break;
            case 'checkbox': this.renderCheckboxComponent(componentData, questionKey);
              break;
            case 'rating': this.renderRatingComponent(componentData, questionKey);
              break;
          }
        });
        this.loadFormComponents();
        this.canRender = true;
        if (this.readOnly) { this.form.disable(); }
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
        //In case the user tries to enter invalid template id in preview:
        if (error.error.error === 'Message not found.' || error.error.code === 'JOIFALSE') {
          this.toaster.showError('Error', 'Template not found');
          this.route.navigate(['list-templates']);
        }
      }
    )
  }

  renderRadioComponent(componentData, questionKey, value = '') {
    this.fields.push({
      type: "radio",
      name: questionKey,
      quesno: this.splitQNo(questionKey),
      question: componentData.question,
      labels: componentData.labels
    });
  }
  renderTextComponent(componentData, questionKey) {
    this.fields.push({
      type: "text",
      name: questionKey,
      quesno: this.splitQNo(questionKey),
      question: componentData.question
    });
  }
  renderCheckboxComponent(componentData, questionKey) {
    this.fields.push({
      type: "checkbox",
      name: questionKey,
      quesno: this.splitQNo(questionKey),
      question: componentData.question,
      labels: componentData.labels
    });
  }
  renderRatingComponent(componentData, questionKey) {
    this.fields.push({
      type: "rating",
      name: questionKey,
      quesno: this.splitQNo(questionKey),
      question: componentData.question,
      labels: (componentData.labels).reverse()
    });
  }
  splitQNo(questionKey) {
    let Quesno = questionKey.split('_');
    return Quesno[Quesno.length - 1];
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  decline(): void {
    this.modalRef.hide();
  }
}
