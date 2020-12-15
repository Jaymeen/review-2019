import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sessionexpirepage',
  templateUrl: './sessionexpirepage.component.html',
  styleUrls: ['./sessionexpirepage.component.scss']
})
export class SessionexpirepageComponent implements OnInit {

  constructor() { }
  ngOnInit() { }
  goHome() {
    window.location.href = '/';
  }

}
