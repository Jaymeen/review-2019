import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-field-builder',
  templateUrl: './field-builder.component.html',
  styleUrls: ['./field-builder.component.scss']
})
export class FieldBuilderComponent implements OnInit {

  @Input() field: any;
  @Input() form: any;
  constructor() { }
  ngOnInit() {
  }
}
