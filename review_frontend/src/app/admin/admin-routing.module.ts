import { SearchEmployeeComponent, ListSessionsComponent, SessionDetailsComponent, ListTemplatesComponent, AdmindashboardComponent } from './components/index';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SessionTemplateMappingComponent } from './components/sessions/session-template-mapping/session-template-mapping.component';
import { MappingComponentComponent } from './components/sessions/mapping-component/mapping-component.component';
import { AuthGuard } from '../shared/auth.guard';
import { RoleGuard } from '../shared/role.guard';

export const routes: Routes = [
  { path: '', component: AdmindashboardComponent },
  { path: 'search-employee', component: SearchEmployeeComponent, canActivate: [AuthGuard] },
  { path: 'list-sessions', component: ListSessionsComponent, data: { role: 'ROLE_SADMIN' }, canActivate: [AuthGuard, RoleGuard] },
  { path: 'session-details', component: SessionDetailsComponent, data: { role: 'ROLE_SADMIN' }, canActivate: [AuthGuard, RoleGuard] },  
  { path: 'session-details/:sessionId', component: SessionDetailsComponent, data: { role: 'ROLE_SADMIN' }, canActivate: [AuthGuard, RoleGuard] },
  { path: 'session-mapping/:sessionId', component: MappingComponentComponent, data: { role: 'ROLE_SADMIN' }, canActivate: [AuthGuard, RoleGuard] },
  { path: 'session-mapping-details/:sessionId', component: SessionTemplateMappingComponent, data: { role: 'ROLE_SADMIN' }, canActivate: [AuthGuard, RoleGuard] },
  { path: 'list-templates', component: ListTemplatesComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/errorpage' }
];

// taken from angular.io
// Only call RouterModule.forRoot in the root AppRoutingModule (or the AppModule if
// that's where you register top level application routes). In any other module, you
// must call the RouterModule.forChild method to register additional routes.

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [
    RouterModule
  ]
})
export class AdminRoutingModule { }
