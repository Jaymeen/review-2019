import { CustomValidatorsService } from './../../services/custom-validators.service';
import { Component, OnInit, TemplateRef, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormArray, FormControl, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TemplateService } from '../../services/template.service';
import { ToasterService } from '../../services/toaster.service';
import { EncryptionService } from '../../services/encryption.service';
import { constant } from 'src/app/app.const';
import { NgxSpinnerService } from 'ngx-spinner';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { LivenotificationService } from 'src/app/base/services/livenotification.service';
import { GetTextComponent } from './get-text/get-text.component';
import { GetCheckboxComponent } from './get-checkbox/get-checkbox.component';
import { GetRatingComponent } from './get-rating/get-rating.component';
import { GetRadioComponent } from './get-radio/get-radio.component';

@Component({
  selector: 'app-template-create',
  templateUrl: './template-create.component.html',
  styleUrls: ['./template-create.component.scss']
})

export class TemplateCreateComponent implements OnInit {

  private errorElement: ElementRef;
  @ViewChild('textComponent') textComponent: GetTextComponent;
  @ViewChild('radioComponent') radioComponent: GetRadioComponent;
  @ViewChild('checkboxComponent') checkboxComponent: GetCheckboxComponent;
  @ViewChild('ratingComponent') ratingComponent: GetRatingComponent;

  @ViewChild('formArea') formAreaElement: ElementRef;
  @ViewChild('dropArea') dropAreaElement: ElementRef;
  @ViewChild('error') set content(content: ElementRef) {
    this.errorElement = content;
  }
  public errorDescriptionElement: ElementRef;
  @ViewChild('errorDescriptionElement') set contentDescription(content: ElementRef) {
    this.errorDescriptionElement = content;
  }
  public nameElement: ElementRef;
  @ViewChild('nameElement') set assetInput(elRef: ElementRef) {
    this.nameElement = elRef;
  }
  public descriptionElement: ElementRef;
  @ViewChild('descriptionElement') set assetInputDescription(elRef: ElementRef) {
    this.descriptionElement = elRef;
  }

  //when admin press save then olly the componet's data will store in this array 
  components = [];
  //for contols
  componentList: FormGroup;
  componentArray: FormArray;
  templateObject: any;
  errorMessage: any = [];
  resonseStatus;
  submitted: boolean;
  invalidFlag = false;
  updateFlag = false;
  previewFlag = false;
  userData;
  //for drag and drop
  draggedComponent;
  templateComponentIndex = constant.TEMPLATECOMPONENTINDEX;
  radio = constant.TEMPLATECOMPONENTINDEX.radio.value;
  text = constant.TEMPLATECOMPONENTINDEX.text.value;
  rating = constant.TEMPLATECOMPONENTINDEX.rating.value;

  checkbox = constant.TEMPLATECOMPONENTINDEX.checkbox.value; templateName: any;
  maxLengthForName;
  maxLengthDescription;

  //to detect change in component list and notify the child component 
  change: boolean = false;
  maxLength: number;
  templateId;
  templateStatus: string;
  templateValue: number = 0;
  draftTemplate: boolean = true;
  templateUsed: boolean = false;
  action: boolean;
  modalRef: BsModalRef;

  constructor(
    private formBuilder: FormBuilder,
    public toast: ToasterService,
    private router: Router,
    private route: ActivatedRoute,
    private encryptedService: EncryptionService,
    private customValidatorsService: CustomValidatorsService,
    private templateService: TemplateService,
    private spinner: NgxSpinnerService,
    private modalService: BsModalService,
    private liveNotification: LivenotificationService,
    private changeDetector: ChangeDetectorRef) {

    this.templateId = this.route.snapshot.paramMap.get('id');
    this.action = this.route.snapshot.data.action === 'clone';
    this.updateFlag = this.route.snapshot.data.action === 'update';
    this.componentArray = new FormArray([]);
    this.maxLength = constant.MAXLENGTH;
    this.maxLengthDescription = constant.MAXLENGTHFORDESCRIPTION;
    this.maxLengthForName = constant.MAXLENGTHFORNAME;

    this.componentList = this.formBuilder.group({
      templateName: ['', [Validators.required, this.customValidatorsService.textboxValidators(), Validators.maxLength(this.maxLengthForName), Validators.pattern(/^[\w\- ][\w\- ]*$/i)], this.customValidatorsService.nameValidator("template", Number(this.templateId), this.updateFlag)],
      templateDescription: ['', [Validators.required, this.customValidatorsService.textboxValidators(), Validators.maxLength(this.maxLengthDescription)]],
      componentArray: this.formBuilder.array([])
    });

    this.userData = JSON.parse(localStorage.getItem('userdata'));
    this.userData.user_id = this.encryptedService.get(
      constant.ENCRYPTIONKEY,
      this.userData.user_id
    );
  }

  ngOnInit() {
    //for update template 
    if (this.templateId) {
      this.loadData(this.templateId);
    } else {
      this.templateStatus = 'newTemplate';
    }
  }

  storeData(data: any) {
    if (data == null) {
      this.toast.showError('Error', 'Invalid template data');
      this.router.navigate(['list-templates']);
    }
    else if (data.templateStatus == 'used' && !this.action) {
      this.toast.showInfo('info', 'Template in use, can not edit');
      this.router.navigate(['list-templates']);
    }
    else {
      this.componentList.patchValue({ templateName: data.templateName, templateDescription: data.templateDescription })
      if (this.action) {
        this.componentList.patchValue({ templateName: `copy of ${data.templateName}` })
      }
      data.templateStructure.map(element => {
        const componentData = (Object.values(element))[0];
        let type = componentData['type'];
        switch (type) {
          case 'radio': this.renderRadioComponent(componentData);
            break;
          case 'text': this.renderTextComponent(componentData)
            break;
          case 'checkbox': this.renderCheckboxComponent(componentData);
            break;
          case 'rating': this.renderRatingComponent(componentData);
            break;
        }
      });
    }
    this.spinner.hide();
  }

  trimValue(event, controlName) {
    event.target.value = event.target.value.trim();
    this.componentList.controls[controlName].setValue(event.target.value);
  }

  dragStart(event, component) {
    this.draggedComponent = component;
  }


  drop(event) {
    if (this.draggedComponent) {
      switch (this.draggedComponent) {
        case this.radio: this.renderRadioComponent();
          break;
        case this.text: this.renderTextComponent();
          break;
        case this.rating: this.renderRatingComponent();
          break;
        case this.checkbox: this.renderCheckboxComponent();
          break;
      }
    }
  }

  dragEnd(event) {
    this.draggedComponent = null;
  }

  loadData(templateId) {
    //to store template data for update 
    this.templateService.getTemplate(templateId).subscribe(
      data => {
        this.templateStatus = data.templateStatus;
        if (this.templateStatus === 'draft' || this.action) {
          this.draftTemplate = true;
        } else if (this.templateStatus === 'unused') {
          this.draftTemplate = false;
        }
        this.storeData(data);
      },
      error => {
        this.spinner.hide();
        this.toast.showError('Error', 'Invalid template data template');
        this.router.navigate(['list-templates']);
      }
    )
  }

  //get template object
  getTemplateObject(): any {
    this.templateObject = {
      "user_id": this.userData.user_id,
      "template_name": this.componentList.get('templateName').value,
      "template_description": this.componentList.get('templateDescription').value,
      "template_structure": this.components,
    }
    return this.templateObject;
  }

  //store component into form array
  renderRadioComponent(componentData?: any) {
    this.change = !this.change;
    this.componentArray = (this.componentList.get('componentArray') as FormArray);
    this.componentArray.push(this.formBuilder.group({
      type: "radio",
      data: componentData
    }));
  }

  renderTextComponent(componentData?: any) {
    this.change = !this.change;
    this.componentArray = (this.componentList.get('componentArray') as FormArray);
    this.componentArray.push(this.formBuilder.group({
      type: "text",
      data: componentData
    }));

  }

  renderCheckboxComponent(componentData?: any) {
    this.change = !this.change;
    this.componentArray = (this.componentList.get('componentArray') as FormArray);
    this.componentArray.push(this.formBuilder.group({
      type: "checkbox",
      data: componentData
    }));
  }

  renderRatingComponent(componentData?: any) {
    this.change = !this.change;
    this.componentArray = (this.componentList.get('componentArray') as FormArray);
    this.componentArray.push(this.formBuilder.group({
      type: "rating",
      data: componentData
    }));
  }

  //remove component from form array
  removeComponent(index: number) {
    this.componentArray.removeAt(index);
    this.components.splice(index, 1);
  }

  //save component data into components array
  appendRadioJson(data, index) {
    this.components.splice(index, 1, {
      "type": "radio",
      "question": data.question,
      "labels": data.labels.map(element => {
        return element.option
      }
      )
    });
  }

  appendTextJson(data, index) {
    this.components.splice(index, 1, {
      "type": "text",
      "question": data.question
    });
  }

  appendCheckboxJson(data, index) {
    this.components.splice(index, 1, {
      "type": "checkbox",
      "question": data.question,
      "labels": data.labels.map(element => {
        return element.option
      }
      )
    });
  }

  appendRatingJson(data, index) {
    this.components.splice(index, 1, {
      "type": "rating",
      "question": data.question,
      "labels": data.labels.map(element => {
        return element.option
      })
    });
  }

  resolveAfter2Seconds(x) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(x);
      }, 500);
    });
  }

  stop(flag) {
    this.changeDetector.detectChanges();
    if (!flag) {
      this.submitted = false;
    }
  }

  createTemplate(templateValue) {
    this.templateObject = this.getTemplateObject();
    if (templateValue === 0) {
      this.templateObject.saveAsDraft = false;
    } else {
      this.templateObject.saveAsDraft = true;
    }

    this.templateService.createTemplate(this.templateObject).subscribe(
      x => {
        this.resonseStatus = x.value;
        if (templateValue === 1) {
          this.toast.showSuccess('Success', 'Template saved as draft');
          this.navigateToListTemplates();
        } else if (templateValue === 2) {
          this.router.navigate(['preview', this.resonseStatus], { queryParams: { origin: 'create' } });
        }
        else {
          this.toast.showSuccess('Success', 'Template created successfully');
          if (parseInt(this.route.snapshot.queryParamMap.get('comingFromMapping')) === 1) {
            this.templateService.storeTemplateIdAndName(x)
            this.router.navigate([`session-mapping/${this.route.snapshot.queryParamMap.get('id')}`]);
          }
          else {
            this.navigateToListTemplates();
          }
        }
        this.liveNotification.sendMessage();
      },
      error => {
        this.submitted = false;
        this.toast.showError('Error', 'Invalid data !');
      }
    );
  }

  updateTemplate(templateValue) {
    this.templateObject = this.getTemplateObject();
    if (templateValue === 0) {
      this.templateObject.saveAsDraft = false;
    } else {
      if (this.templateStatus === 'unused') {
        this.templateObject.saveAsDraft = false;
      } else {
        this.templateObject.saveAsDraft = true;
      }
    }

    this.templateService.updateTemplate(this.templateId, this.templateObject).subscribe(
      x => {
        this.toast.showSuccess('Success', 'Template saved successfully');
        if (templateValue === 2) {
          this.router.navigate(['preview', this.templateId], { queryParams: { origin: 'create' } });
        } else {
          this.navigateToListTemplates();
        }
        this.liveNotification.sendMessage();
      },
      error => {
        this.toast.showError('Error', 'Template updation failed');
        this.submitted = false;
      }
    )
  }

  async onSubmit() {
    this.change = !this.change;
    if (this.componentList.valid && this.componentArray.length === 0) {
      this.toast.showInfo('Information', 'Please provide at least one question')
    }

    if (this.componentList.valid && this.componentArray.valid && this.componentArray.length > 0) {
      this.submitted = true;
      this.invalidFlag = false;
      this.templateValue = 0;

      const value = <number>await this.resolveAfter2Seconds(20);
      if (this.submitted) {
        if (!this.updateFlag) {
          this.createTemplate(this.templateValue);
        } else {
          //for update
          this.updateTemplate(this.templateValue);
        }
      }
    }
    else {
      this.invalidFlag = true;
      if (this.errorElement)
        this.nameElement.nativeElement.focus();
      if (this.errorDescriptionElement)
        this.descriptionElement.nativeElement.focus();
      this.customValidatorsService.markFormGroupTouched(this.componentList);
    }
  }

  onCancel(template: TemplateRef<any>) {
    if (this.componentList.valid && this.components.length > 0) {
      this.modalRef = this.modalService.show(template);

    }
    else if (parseInt(this.route.snapshot.queryParamMap.get('comingFromMapping')) === 1) {
      this.router.navigate([`session-mapping/${this.route.snapshot.queryParamMap.get('id')}`]);
    }
    else {
      this.navigateToListTemplates();
    }
  }

  async onPreview(isPreview) {
    this.change = !this.change;
    if (this.componentList.valid && this.componentArray.length === 0) {
      this.toast.showInfo('Information', 'Please provide at least one question')
    }

    if (this.componentList.valid && this.componentArray.length > 0) {
      this.invalidFlag = false;
      this.templateValue = isPreview;

      const value = <number>await this.resolveAfter2Seconds(20);

      if (this.templateId && !this.action) {
        this.updateTemplate(this.templateValue);
      } else {
        this.createTemplate(this.templateValue);
      }
    } else {
      this.invalidFlag = true;
      this.customValidatorsService.markFormGroupTouched(this.componentList);
    }
  }

  onModalCancel() {
    this.modalRef.hide();
    if (parseInt(this.route.snapshot.queryParamMap.get('comingFromMapping')) === 1) {
      this.router.navigate([`session-mapping/${this.route.snapshot.queryParamMap.get('id')}`]);
    }
    else {
      this.navigateToListTemplates();
    }
  }

  navigateToListTemplates() {
    this.router.navigate(['list-templates']);
  }

  decline(): void {
    this.modalRef.hide();
  }
}
