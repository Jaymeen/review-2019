import { AuthGuard } from './shared/auth.guard';
import { RoleGuard } from './shared/role.guard';
import { SideNavBarComponent } from './base/components/side-nav-bar/side-nav-bar.component';
import { HeaderBaseComponent } from './base/components/header-base/header-base.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login_/components/login/login.component';
import { ErrorpageComponent } from './shared/components/errorpage/errorpage.component';
import { AdmindashboardComponent } from './admin/components/admindashboard/admindashboard.component';
import { TemplateCreateComponent } from './shared/components/template-create/template-create.component';
import { TemplatePreviewComponent } from '../app/shared/components/template-preview/template-preview.component';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { SessionexpirepageComponent } from './shared/components/sessionexpirepage/sessionexpirepage.component';
import { ResponseComponent } from './shared/components/response/response.component';
import { GiveReviewComponent } from './user/components/give-review/give-review.component';
import { UserDashboardComponent } from './user/components/user-dashboard/user-dashboard.component';
import { ListTemplatesComponent } from './admin/components';
import { NotificationsComponent } from './base/components/notifications/notifications.component';
import { ReviewAnalysisComponent } from './user/components/review-analysis/review-analysis.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'givereview', component: UserDashboardComponent, data:{role:'ROLE_SADMIN'} ,canActivate: [AuthGuard, RoleGuard] },
  { path: 'dashboard', component: UserDashboardComponent, data:{role:'ROLE_MEMBER'} ,canActivate: [AuthGuard, RoleGuard] },
  { path: 'analysis', component: ReviewAnalysisComponent, data:{role:'ROLE_MEMBER'} ,canActivate: [AuthGuard, RoleGuard] },
  { path: 'errorpage', component: ErrorpageComponent },
  { path: 'sessionexpire', component: SessionexpirepageComponent },
  { path: 'header', component: HeaderBaseComponent },
  { path: 'nav', component: SideNavBarComponent },
  { path: 'list-templates', component: ListTemplatesComponent, data: { role: 'ROLE_SADMIN' }, canActivate: [AuthGuard, RoleGuard] },
  { path: 'review/:mappingId', component: GiveReviewComponent, canActivate: [AuthGuard] },
  { path: 'template', component: TemplateCreateComponent, data: { role: 'ROLE_SADMIN' }, canActivate: [AuthGuard, RoleGuard] },
  { path: 'preview/:templateId', component: TemplatePreviewComponent, data: { role: 'ROLE_SADMIN' }, canActivate: [AuthGuard, RoleGuard] },
  { path: 'editTemplate/:id', component: TemplateCreateComponent, data: { action: 'update', role: 'ROLE_SADMIN' }, canActivate: [AuthGuard, RoleGuard] },
  { path: 'cloneTemplate/:id', component: TemplateCreateComponent, data: { action: 'clone', role: 'ROLE_SADMIN' }, canActivate: [AuthGuard, RoleGuard] },
  { path: 'admindashboard', component: AdmindashboardComponent, data: { role: 'ROLE_SADMIN' }, canActivate: [AuthGuard, RoleGuard] },
  { path: 'response/:mappingId', component: ResponseComponent, data: { role: 'ROLE_SADMIN' }, canActivate: [AuthGuard, RoleGuard] },
  { path: 'myreview/:mappingId', component: ResponseComponent, canActivate: [AuthGuard] },
  { path: 'notifications', component: NotificationsComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
