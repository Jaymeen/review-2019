import { routes } from './../admin/admin-routing.module';
import { SessionsService } from './services/sessions.service';
import { BaseModule } from './../base/base.module';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { AdmindashboardComponent, SearchEmployeeComponent, ListSessionsComponent, SessionDetailsComponent, } from './components/index';
import { AdminRoutingModule } from './admin-routing.module';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { SessionTemplateMappingComponent } from './components/sessions/session-template-mapping/session-template-mapping.component';
import { ListTemplatesComponent } from './components/list-templates/list-templates.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { TemplateService } from './services/template.service';
import { MappingComponentComponent } from './components/sessions/mapping-component/mapping-component.component';

@NgModule({
  declarations: [
    SearchEmployeeComponent,
    ListSessionsComponent,
    SessionDetailsComponent,
    AdmindashboardComponent,
    SessionTemplateMappingComponent,
    ListTemplatesComponent,
    MappingComponentComponent,
  ],

  imports: [
    AdminRoutingModule,
    FormsModule,
    CommonModule,
    BrowserModule,
    SharedModule,
    CommonModule,
    DialogModule,
    ButtonModule,
    BrowserModule,
    BrowserAnimationsModule,
    PaginatorModule,
    TableModule,
    TabViewModule,
    ReactiveFormsModule,
    FormsModule,
    TooltipModule,
    BaseModule,
    ReactiveFormsModule
  ],
  providers: [SessionsService, TemplateService],
  bootstrap: []
})
export class AdminModule { }
