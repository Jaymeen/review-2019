import { ToastMessageComponent } from './components/toast-message/toast-message.component';

import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';


export const sharedRoutes: Routes = [
  { path: 'toast', component: ToastMessageComponent }
];
@NgModule({
  imports: [RouterModule.forChild(sharedRoutes)],
  exports: [
    RouterModule
  ]
})
export class SharedRoutingModule {
}
