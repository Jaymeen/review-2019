import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { BaseService } from './services/base.service';
import { HeaderBaseComponent } from './components/header-base/header-base.component';
import { SideNavBarComponent } from './components/side-nav-bar/side-nav-bar.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { NotificationsService } from './services/notifications.service';
import { VirtualScrollerModule } from 'primeng/virtualscroller';
import { TooltipModule } from 'primeng/tooltip';
import { customDateTime } from './custom-date-time';

@NgModule({
  declarations: [
    HeaderBaseComponent,
    SideNavBarComponent,
    NotificationsComponent,
    customDateTime
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AngularFontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    VirtualScrollerModule,
    TooltipModule
  ],
  exports: [
    HeaderBaseComponent,
    SideNavBarComponent,
    customDateTime
  ],

  providers: [BaseService, NotificationsService],

  bootstrap: []
})

export class BaseModule { }
