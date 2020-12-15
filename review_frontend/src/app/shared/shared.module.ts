import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//primeng imports
import {
  InputTextareaModule, TableModule, RatingModule, PaginatorModule, DropdownModule, MultiSelectModule
  , ListboxModule, CalendarModule, InputTextModule, ToastModule, RadioButtonModule
  , CheckboxModule, MessageService, DragDropModule, MessagesModule, TabViewModule, TooltipModule
} from './index-of-primeng-components';
//shared components imports
import {
  ErrorpageComponent, TemplateCreateComponent, GetRadioComponent,
  GetTextComponent,
  TemplatePreviewComponent, GetCheckboxComponent, GetRatingComponent
} from './components/index-of-shared-components';
import { SharedRoutingModule } from './shared-routing.module';
import { BaseModule } from './../base/base.module';
import { ModalModule } from 'ngx-bootstrap';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { ToastMessageComponent } from './components/toast-message/toast-message.component';
import { SessionexpirepageComponent } from './components/sessionexpirepage/sessionexpirepage.component';
import { ResponseComponent } from './components/response/response.component';
import { CardModule } from 'primeng/card';
import { CommentComponent } from './components/comment/comment.component';
import { ReviewResponseComponent } from './components/response/review-response/review-response.component';
import { DynamicFormBuilderModule } from './components/dynamic-form-builder/dynamic-form-builder.module'
import { UiSwitchModule } from 'ngx-toggle-switch';

@NgModule({
  declarations: [
    ErrorpageComponent,
    TemplateCreateComponent,
    GetRadioComponent,
    GetTextComponent,
    TemplatePreviewComponent,
    ToastMessageComponent,
    GetCheckboxComponent,
    GetRatingComponent,
    SessionexpirepageComponent,
    ResponseComponent,
    CommentComponent,
    ReviewResponseComponent,
    SessionexpirepageComponent
  ],
  imports: [
    TableModule,
    CommonModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    PaginatorModule,
    MessagesModule,
    DropdownModule,
    DragDropModule,
    BrowserAnimationsModule,
    CalendarModule,
    InputTextModule,
    ToastModule,
    SharedRoutingModule,
    InputTextareaModule,
    RadioButtonModule,
    CheckboxModule,
    MultiSelectModule,
    RatingModule,
    BaseModule,
    BrowserModule,
    CardModule,
    MessagesModule,
    DragDropModule,
    DynamicFormBuilderModule,
    TabViewModule,
    TooltipModule,
    UiSwitchModule
  ],
  exports: [
    PaginatorModule,
    AngularFontAwesomeModule,
    BrowserAnimationsModule,
    ListboxModule,
    TableModule,
    DropdownModule,
    ListboxModule,
    CalendarModule,
    MessagesModule,
    InputTextModule,
    ToastModule,
    InputTextareaModule,
    MultiSelectModule,
    RatingModule,
    ErrorpageComponent,
    MessagesModule,
    DragDropModule,
    DynamicFormBuilderModule,
    TabViewModule,
    TooltipModule
  ],
  providers: [DatePipe, MessageService],
  bootstrap: []
})
export class SharedModule { }

