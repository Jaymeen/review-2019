import { NgModule } from '@angular/core';
import { GiveReviewComponent } from './components/give-review/give-review.component';
import { CommonModule } from '@angular/common';
import { BaseModule } from './../base/base.module';
import { SharedModule } from './../shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserDashboardComponent } from './components/index';
import { ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { ReviewAnalysisComponent } from './components/review-analysis/review-analysis.component';


@NgModule({
  declarations: [
    GiveReviewComponent,
    UserDashboardComponent,
    ReviewAnalysisComponent],
  imports: [
    ReactiveFormsModule,
    TooltipModule,
    DialogModule,
    SharedModule,
    ButtonModule,
    BrowserModule,
    BrowserAnimationsModule,
    BaseModule,
    CommonModule,
    PaginatorModule,
    TableModule
  ],

  providers: [],
  bootstrap: []
})
export class UserModule { }
