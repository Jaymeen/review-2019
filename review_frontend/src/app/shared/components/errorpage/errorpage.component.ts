import { Component, OnInit } from '@angular/core';
import { ErrorpageService } from '../../services/errorpage.service';
import { Router } from '@angular/router';
import {Location} from '@angular/common';

@Component({
  selector: 'app-errorpage',
  templateUrl: './errorpage.component.html',
  styleUrls: ['./errorpage.component.scss']
})
export class ErrorpageComponent implements OnInit {
  errormessage: string="";
  constructor(private errorpageservice: ErrorpageService, private _router: Router,
    private _location: Location) {
  }

  ngOnInit() {
    this.errormessage = this.errorpageservice.geterrormessage();
    this.errorpageservice.seterrormessage('');
  }
  
  goBack(){
    this._location.back();
  }
}
