import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-review-analysis',
  templateUrl: './review-analysis.component.html',
  styleUrls: ['./review-analysis.component.scss']
})
export class ReviewAnalysisComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    window.scrollTo(0, 0);
  }

}
