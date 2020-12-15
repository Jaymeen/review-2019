import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent implements OnInit {
  @Input() field: any = {};
  @Input() form: FormGroup;
  get controls() { return this.form.controls[this.field.name]; }
  constructor() { }
  ngOnInit() {
  }
}
