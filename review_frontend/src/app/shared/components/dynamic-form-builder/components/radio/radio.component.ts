import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss']
})
export class RadioComponent implements OnInit {
  @Input() field: any = {};
  @Input() form: FormGroup;
  get controls() { return this.form.controls[this.field.name]; }
  constructor() { }
  ngOnInit() {
    
    
  }
}
