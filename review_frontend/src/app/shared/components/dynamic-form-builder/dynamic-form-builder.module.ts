import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
// components
import { DynamicFormBuilderComponent } from './dynamic-form-builder.component';
import { FieldBuilderComponent } from './field-builder/field-builder.component';
import { RadioComponent } from './components/radio/radio.component';
import { RatingComponent } from './components/rating/rating.component';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { TextboxComponent } from './components/textbox/textbox.component';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {RadioButtonModule} from 'primeng/radiobutton';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextareaModule,
    RadioButtonModule
  ],
  declarations: [
    DynamicFormBuilderComponent,
    FieldBuilderComponent,
    RadioComponent,
    RatingComponent,
    CheckboxComponent,
    TextboxComponent
  ],
  exports: [DynamicFormBuilderComponent,RatingComponent],
  providers: []
})
export class DynamicFormBuilderModule { }
