import { Component, OnInit, Input } from '@angular/core';
import { TemplateService } from '../../../services/template.service';
import { ResponseService } from '../../../services/response.service';
import { ToasterService } from '../../../services/toaster.service';
import { Router } from '@angular/router';
import { EncryptionService } from 'src/app/shared/services/encryption.service';
import { constant } from 'src/app/app.const';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-review-response',
  templateUrl: './review-response.component.html',
  styleUrls: ['./review-response.component.scss']
})
export class ReviewResponseComponent implements OnInit {

  @Input() mappingId;
  @Input() templateId;

  responseData: any;
  response: any[] = [];
  role: any;
  form = null;
  canRender = false;

  constructor(private templateService: TemplateService,
    private router: Router,
    private toster: ToasterService,
    private encryptionService: EncryptionService,
    private responseService: ResponseService,
    private spinner: NgxSpinnerService) {

    this.role = this.encryptionService.get(constant.ENCRYPTIONKEY, JSON.parse(localStorage.getItem('userdata')).role);;
  }

  ngOnInit() {
    this.loadresponseData(this.mappingId);
  }

  loadresponseData(mappingId) {
    this.responseService.getResponse(mappingId).subscribe(
      data => {
        this.responseData = data.response[0];
        this.loadData(this.templateId);
      },
      error => {
        this.spinner.hide();
        if (error.error.code === 'NORECORD') {
          this.toster.showError('Error', "No response data found for this record");
          if (this.role === 'ROLE_SADMIN') {
            if (this.router.url.includes("response")) {
              this.router.navigate(['admindashboard']);
            }
            else {
              this.router.navigate(['givereview']);
            }
          }
          else {
            this.router.navigate(['dashboard']);
          }
        }
      }
    );
  }

  loadData(template_id) {
    this.templateService.getTemplate(template_id).subscribe(
      data => {
        let fieldsCtrls = {};
        data.templateStructure.map((e, index) => {
          let questionKey = Object.keys(e)[0];
          switch (e[questionKey].type) {
            case 'checkbox':
              let ans = this.responseData[questionKey];
              let anskey = Object.keys(this.responseData[questionKey]);
              let data = [];
              anskey.forEach(x => {
                if (ans[x] === true) {
                  data.push(x);
                }
              })
              this.response.push({
                "type": e[questionKey].type,
                "question": e[questionKey].question,
                "answer": data.toString()
              });
              break;
            case 'rating':
              fieldsCtrls[e[questionKey].type + index] = new FormControl(`${this.responseData[questionKey]}`, [Validators.required]);

              this.response.push({
                "name": e[questionKey].type + index,
                "labels": (e[questionKey].labels).reverse(),
                "type": e[questionKey].type,
                "question": e[questionKey].question,
                "answer": this.responseData[questionKey]
              });
              break;
            default:
              this.response.push({
                "type": e[questionKey].type,
                "question": e[questionKey].question,
                "answer": this.responseData[questionKey]
              });
              break;
          }

        });
        this.form = new FormGroup(fieldsCtrls);
        this.canRender = true;
        this.form.disable();
        this.spinner.hide();
      },
      error => { this.spinner.hide(); 'opps :' + error }
    )
  }
}
