import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent {
  @Input() field: any = {};
  @Input() form: FormGroup;
  get controls() { return this.form.controls[this.field.name]; }
  constructor() { }
}
