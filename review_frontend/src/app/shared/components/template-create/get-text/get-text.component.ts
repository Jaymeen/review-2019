
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, Renderer } from '@angular/core';
import { MessageServiceDemo } from 'src/app/shared/services/message.service';
import { TemplateService } from 'src/app/shared/services/template.service';
import { constant } from 'src/app/app.const';
import { CustomValidatorsService } from 'src/app/shared/services/custom-validators.service';

@Component({
  selector: 'app-get-text',
  templateUrl: './get-text.component.html',
  styleUrls: ['./get-text.component.scss']
})
export class GetTextComponent implements OnInit {

  @Output() store: EventEmitter<any> = new EventEmitter<any>();
  @Output() display: EventEmitter<any> = new EventEmitter<any>();
  @Output() remove: EventEmitter<any> = new EventEmitter<any>();
  @Input() mainFormSubmit: boolean;
  @Input('data') data: any;
  @Input() change: boolean;
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

  textFieldForm: FormGroup;
  maxLength: number;
  constructor(private formbuilder: FormBuilder,
    private customValidatorsService: CustomValidatorsService) {
    this.maxLength = constant.MAXLENGTH;
    this.textFieldForm = this.formbuilder.group({
      question: ['', [Validators.required, this.customValidatorsService.textboxValidators(), Validators.maxLength(this.maxLength), Validators.pattern(/^[\w\- _,!\[\]#@*+~<>{}&%.:/\\()?]*$/i)]],
    });
  }

  ngOnInit() {
    this.customValidatorsService.markFormGroupUntouched(this.textFieldForm);

    //in case for template update
    if (this.data !== null) {
      this.textFieldForm.patchValue({ question: this.data.question })
    }
  }

  ngOnChanges() {
    this.onSubmit();
  }

  onRemove() {
    this.remove.emit()
  }
  onSubmit() {
    if (this.textFieldForm.invalid) {
      this.customValidatorsService.markFormGroupTouched(this.textFieldForm);
      if (this.errorElement)
        this.questionElement.nativeElement.focus();
      this.stop.emit(false);

    } else {
      this.display.emit(this.textFieldForm.value);
    }
  }

  trimValue(event, controlName) {
    event.target.value = event.target.value.trim();
    this.textFieldForm.controls[controlName].setValue(event.target.value);
  }
}

