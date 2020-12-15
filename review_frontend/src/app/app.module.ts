import { ToasterService } from './shared/services/toaster.service';
import { BaseService } from './base/services/base.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminModule } from './admin/admin.module';
import { UserModule } from './user/user.module';
import { LoginModule } from './login_/login_.module';
import { SocialLoginModule, AuthServiceConfig, GoogleLoginProvider } from 'angular-6-social-login';
import { SharedModule } from './shared/shared.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BaseModule } from './base/base.module';
import { SessionsService } from './admin/services/sessions.service';
import { TemplateService } from './admin/services/template.service';
import { ConnectionService } from './shared/services/connection.service';
import { ErrorpageService } from './shared/services/errorpage.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthorizationService } from './shared/services/authorization.service';
import { UserIdleModule } from 'angular-user-idle';
import { AuthGuard } from './shared/auth.guard';
import { RoleGuard } from './shared/role.guard';
import { EncryptionService } from './shared/services/encryption.service';
import { NgxSpinnerModule } from 'ngx-spinner';

export function getAuthServiceConfigs() {
  const config = new AuthServiceConfig(
    [{
      id: GoogleLoginProvider.PROVIDER_ID,
      provider: new GoogleLoginProvider('461047377975-ia3ciuhpc67skqcv3vr0p9dealp3lglp.apps.googleusercontent.com')
    }]
  );
  return config;
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    AdminModule,
    UserModule,
    SocialLoginModule,
    LoginModule,
    SharedModule,
    FormsModule,
    BaseModule,
    UserIdleModule.forRoot({ idle: 1800, timeout: 10, ping: 60 }),
    RouterModule,
    NgxSpinnerModule
  ],
  providers: [{
    provide: AuthServiceConfig,
    useFactory: getAuthServiceConfigs,
  }, AuthorizationService,
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthorizationService,
    multi: true
  },
    EncryptionService,
    BaseService,
    SessionsService,
    TemplateService,
    BaseService,
    ConnectionService,
    ErrorpageService,
    ToasterService,
    AuthGuard,
    RoleGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
