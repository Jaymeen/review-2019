import { Component, OnInit, Input } from '@angular/core';
import { AuthService, GoogleLoginProvider } from 'angular-6-social-login';
import { Router } from '@angular/router';
import { ConnectionService } from '../../../shared/services/connection.service';
import { ErrorpageService } from '../../../shared/services/errorpage.service';
import { constant } from '../../../app.const';
import { EncryptionService } from 'src/app/shared/services/encryption.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  data_user: any;
  image: any;
  tempUserMail: string;
  constructor(private socialAuthService: AuthService, private _router: Router,
    private connectionservice: ConnectionService,
    private errorpageservice: ErrorpageService,
    private encryptionService: EncryptionService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    if (localStorage.getItem('usermail') != null) {
      this.tempUserMail = this.encryptionService.get(constant.ENCRYPTIONKEY, localStorage.getItem('usermail'));
      this.getUserData(this.tempUserMail);
    }
  }

  public socialSignIn(socialPlatform: string) {
    let socialPlatformProvider;
    socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    this.socialAuthService.signIn(socialPlatformProvider).then(
      (userData) => {
        const mail_domain = userData.email.split('@');
        if (!(mail_domain[1] === 'argusoft.in' || mail_domain[1] === 'argusoft.com')) {
          this.errorpageservice.seterrormessage('Unauthorized Mail id');
          this._router.navigate(['errorpage']);
        } else {
          this.image = userData.image;
          localStorage.setItem('image', this.image);
          this.getUserData(userData.email);
        }
      }
    );
  }

  getUserData(userMail) {
    this.connectionservice.getUser(userMail).subscribe((data: any) => {
      localStorage.setItem('usermail', this.encryptionService.set(constant.ENCRYPTIONKEY, userMail));
      this.data_user = {
        user_id: this.encryptionService.set(constant.ENCRYPTIONKEY, data.user_id),
        full_name: this.encryptionService.set(constant.ENCRYPTIONKEY, data.full_name),
        role: this.encryptionService.set(constant.ENCRYPTIONKEY, data.role),
        active_status: this.encryptionService.set(constant.ENCRYPTIONKEY, data.active_status),
        designation: data.designation
      };
      localStorage.setItem('userdata', JSON.stringify(this.data_user));
      localStorage.setItem('token', data.token);
      if (this.image != undefined) {
        localStorage.setItem('image', this.image);
      }
      // re-direct user based on the role:
      if (data.role === 'ROLE_MEMBER') {
        this._router.navigate(['dashboard']);
      } else if (data.role === 'ROLE_SADMIN') {
        this._router.navigate(['admindashboard']);
      } else {
        this.errorpageservice.seterrormessage('Unauthorized Mail id');
        localStorage.clear();
        this._router.navigate(['errorpage']);
      }
      this.spinner.hide();
    }, (error) => {
      this.spinner.hide();
      if (error.error.code === 'JOIFALSE' || error.error.code === 'LOGINFALSE') {
        this.errorpageservice.seterrormessage(`Unauthorized Mail id`);
        localStorage.clear();
        this._router.navigate(['errorpage']);
      }
      else if (error.error.code === 'JWTFALSE') {
        localStorage.clear();
        this._router.navigate(['sessionexpire']);
      }
      else {
        this.errorpageservice.seterrormessage(`We are having trouble connecting to our server,
       please try again later`);
        this._router.navigate(['errorpage']);
      }
    }
    );
  }
}
