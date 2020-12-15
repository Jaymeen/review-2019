import { Component, OnInit, Input, Output, EventEmitter, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormArray, FormControl, ValidatorFn, AbstractControl } from '@angular/forms';
import { MessageServiceDemo } from 'src/app/shared/services/message.service';
import { TemplateService } from 'src/app/shared/services/template.service';
import { constant } from 'src/app/app.const';
import { CustomValidatorsService } from 'src/app/shared/services/custom-validators.service';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
@Component({
  selector: 'app-get-rating',
  templateUrl: './get-rating.component.html',
  styleUrls: ['./get-rating.component.scss']
})
export class GetRatingComponent implements OnInit, OnChanges {

  @Output() display: EventEmitter<any> = new EventEmitter<any>();
  @Output() remove: EventEmitter<any> = new EventEmitter<any>()
  @Input() mainFormSubmit: boolean;
  @Input() previewFlag: boolean;
  @Input() change: boolean;
  @Input('data') data: any;
  @Output() stop: EventEmitter<any> = new EventEmitter<any>();
  public errorElement: ElementRef;
  @ViewChild('error') set content(content: ElementRef) {
    this.errorElement = content;
  }
  public questionElement: ElementRef;
  @ViewChild('questionElement') set assetInput(elRef: ElementRef) {
    this.questionElement = elRef;
  }

  ratingFieldForm: FormGroup;
  submitted = false;
  labels: FormArray;
  labelFlag = false;     //for add label button to change the style
  maxLength: number;
  temp = [];
  constructor(private formBuilder: FormBuilder,
    private customValidatorsService: CustomValidatorsService) {
    this.maxLength = constant.MAXLENGTH;
    this.labels = new FormArray([]);
    this.ratingFieldForm = this.formBuilder.group({
      question: ['', [Validators.required, this.customValidatorsService.textboxValidators(), Validators.maxLength(this.maxLength), Validators.pattern(/^[\w\- _,!\[\]#@*+~<>{}&%.:/\\()?]*$/i)]],
      labels: this.formBuilder.array([])
    });
    this.temp = ['Poor', 'Average', 'Good'];

  }

  ngOnInit() {
    this.customValidatorsService.markFormGroupUntouched(this.ratingFieldForm);

    this.labels = (this.ratingFieldForm.get('labels') as FormArray);
    if (this.data !== null) {
      this.ratingFieldForm.patchValue({ question: this.data.question })

      this.data.labels.forEach(element => {
        this.labels.push(this.formBuilder.group({
          option: [`${element}`, Validators.required]
        }))
      });
    } else {
      //default case
      this.temp.forEach(label => {
        this.labels.push(this.formBuilder.group({
          option: [`${label}`]
        }))
      });
    }

    this.ratingFieldForm.valueChanges.subscribe(value => {
      this.labelFlag = this.ratingFieldForm.invalid;
    })
  }

  ngOnChanges() {
    this.onSubmit();
  }

  getLabel(): FormGroup {
    return this.formBuilder.group({
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
    } else {
      this.labels = (this.ratingFieldForm.get('labels') as FormArray);
      this.labels.push(this.getLabel())
    }
  }

  setLabelValue(i: number) {
    let val = this.ratingFieldForm.get('labels').get(i.toString()).get('option').value.trim();
    this.ratingFieldForm.get('labels').get(i.toString()).get('option').setValue(val);
  }
  onRemove() {
    this.remove.emit()
  }

  removeLabel(index) {
    this.labels.removeAt(index);
    this.labelFlag = false;
  }
  onSubmit() {
    if (this.ratingFieldForm.invalid) {
      this.customValidatorsService.markFormGroupTouched(this.ratingFieldForm);
      if (this.errorElement)
        this.questionElement.nativeElement.focus();
      this.stop.emit(false);

    } else if (this.ratingFieldForm.valid && this.labels.value.length < 3) {
      this.customValidatorsService.markFormGroupTouched(this.ratingFieldForm);
      if (this.errorElement)
        this.questionElement.nativeElement.focus();
      this.stop.emit(false);
    }
    else {
      this.onSave();
      this.display.emit(this.ratingFieldForm.value);
    }
  }
  onSave() {
    this.labelFlag = true;
    this.submitted = true;
  }

  trimValue(event, controlName) {
    event.target.value = event.target.value.trim();
    this.ratingFieldForm.controls[controlName].setValue(event.target.value);
  }
}
