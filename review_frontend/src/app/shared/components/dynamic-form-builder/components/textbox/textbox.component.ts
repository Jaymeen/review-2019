import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-textbox',
  templateUrl: './textbox.component.html',
  styleUrls: ['./textbox.component.scss']
})
export class TextboxComponent implements OnInit {

  @Input() field: any = {};
  @Input() form: FormGroup;
  get controls() {  return this.form.controls[this.field.name]; }
  trimValue(event) { 
    event.target.value = event.target.value.trim(); 
    this.form.controls[this.field.name].setValue(event.target.value); 
  }
  constructor() { }
  ngOnInit() {
  }
}
