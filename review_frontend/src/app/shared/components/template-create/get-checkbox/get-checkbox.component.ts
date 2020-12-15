import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { MessageServiceDemo } from 'src/app/shared/services/message.service';
import { TemplateService } from 'src/app/shared/services/template.service';
import { constant } from 'src/app/app.const';
import { CustomValidatorsService } from 'src/app/shared/services/custom-validators.service';
import { RxwebValidators, ReactiveFormConfig } from '@rxweb/reactive-form-validators';
@Component({
  selector: 'app-get-checkbox',
  templateUrl: './get-checkbox.component.html',
  styleUrls: ['./get-checkbox.component.scss']
})
export class GetCheckboxComponent implements OnInit {

  @Output() display: EventEmitter<any> = new EventEmitter<any>();
  @Output() remove: EventEmitter<any> = new EventEmitter<any>()
  @Input() mainFormSubmit: boolean;
  @Input('data') data: any;
  @Input('change') change: boolean;
  @Input('unsavedMessage') unsavedMessage;
  @Input() previewFlag: boolean;
  @Output() stop: EventEmitter<any> = new EventEmitter<any>();

  public errorElement: ElementRef;
  @ViewChild('error') set content(content: ElementRef) {
    this.errorElement = content;
  }
  public questionElement: ElementRef;
  @ViewChild('questionElement') set assetInput(elRef: ElementRef) {
    this.questionElement = elRef;
  }

  checkboxFieldForm: FormGroup;
  submitted = false;
  labels: FormArray;
  labelFlag = false;     //for add label button to change the style
  maxLength: number;

  constructor(private fb: FormBuilder,
    private customValidatorsService: CustomValidatorsService) {
    this.labels = new FormArray([]);
    this.maxLength = constant.MAXLENGTH;
    this.checkboxFieldForm = this.fb.group({
      question: ['', [Validators.required, this.customValidatorsService.textboxValidators(), Validators.maxLength(this.maxLength), Validators.pattern(/^[\w\- _,!\[\]#@*+~<>{}&%.:/\\()?]*$/i)]],
      labels: this.fb.array([])
    });
  }

  ngOnInit() {
    this.customValidatorsService.markFormGroupUntouched(this.checkboxFieldForm);

    if (this.data !== null) {
      this.checkboxFieldForm.patchValue({ question: this.data.question })
      this.labels = (this.checkboxFieldForm.get('labels') as FormArray);
      this.data.labels.forEach(element => {
        this.labels.push(this.fb.group({
          option: [`${element}`, [Validators.required]]
        }))
      });
    } else {
      this.addLabel();
    }
    this.checkboxFieldForm.valueChanges.subscribe(
      value => {
        this.labelFlag = this.checkboxFieldForm.invalid;
      }
    );
  }

  ngOnChanges() {
    this.onSubmit();
  }

  getLabel(): FormGroup {
    return this.fb.group({
      option: [``,
        [Validators.required,
        RxwebValidators.unique(),
        Validators.pattern(/^[\w\- _,!\[\]#@*+~<>{}&%.:/\\()?]*$/i),
        this.customValidatorsService.textboxValidators(),
        Validators.maxLength(this.maxLength)
        ]]
    });
  }
  addLabel() {
    if (this.submitted) {
      this.labelFlag = true;
    }
    this.labels = (this.checkboxFieldForm.get('labels') as FormArray);
    this.labels.push(this.getLabel())
  }

  setLabelValue(i: number) {
    let val = this.checkboxFieldForm.get('labels').get(i.toString()).get('option').value.trim();
    this.checkboxFieldForm.get('labels').get(i.toString()).get('option').setValue(val);
  }

  onRemove() {
    this.remove.emit()
  }

  removeLabel(index) {
    this.labels.removeAt(index);
    this.labelFlag = false;
  }
  onSubmit() {
    if (this.checkboxFieldForm.invalid) {
      this.customValidatorsService.markFormGroupTouched(this.checkboxFieldForm);
      if (this.errorElement)
        this.questionElement.nativeElement.focus();
      this.stop.emit(false);

    } else if (this.checkboxFieldForm.valid && this.labels.value.length < 1) {
      this.customValidatorsService.markFormGroupTouched(this.checkboxFieldForm);
      if (this.errorElement)
        this.questionElement.nativeElement.focus();
      this.stop.emit(false);
    } else {
      this.onSave();
      this.display.emit(this.checkboxFieldForm.value);
    }
  }

  onSave() {
    this.labelFlag = true;
    this.submitted = true;
  }

  trimValue(event, controlName) {
    event.target.value = event.target.value.trim();
    this.checkboxFieldForm.controls[controlName].setValue(event.target.value);
  }
}


