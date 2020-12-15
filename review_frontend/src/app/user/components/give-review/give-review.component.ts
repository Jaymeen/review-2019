import { Component, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EncryptionService } from '../../../shared/services/encryption.service';
import { constant } from '../../../app.const';
import { ReviewsService } from '../../services/reviews.service';
import { ToasterService } from '../../../shared/services/toaster.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LivenotificationService } from 'src/app/base/services/livenotification.service';


@Component({
  selector: 'app-give-review',
  templateUrl: './give-review.component.html',
  styleUrls: ['./give-review.component.scss']
})
export class GiveReviewComponent implements OnInit {

  public userId;
  public role;
  public revieweeData: any;
  public form: FormGroup;
  public data: any;
  public mappingId;
  public canCall = false;
  public fields: any[] = [];

  constructor(public route: ActivatedRoute,
    private router: Router,
    public toast: ToasterService,
    private encryptionService: EncryptionService,
    public reviewservice: ReviewsService,
    private spinner:NgxSpinnerService,
    private liveNotification: LivenotificationService) {
  }
  ngOnInit() {
    let userData = JSON.parse(localStorage.getItem('userdata'));
    this.role=this.encryptionService.get(constant.ENCRYPTIONKEY, userData.role);
    if(this.role==='ROLE_SADMIN'){
      this.role = "/givereview"
    }
    else{
      this.role = "/dashboard"
    }
    this.userId = Number(this.encryptionService.get(constant.ENCRYPTIONKEY, userData.user_id));
    this.mappingId = Number(this.route.snapshot.paramMap.get('mappingId'));
    this.reviewservice.getRecords(this.mappingId).subscribe(data => {

      this.revieweeData = data;
      if (this.revieweeData.reviewerId !== this.userId) {
        this.toast.showError('Access Denied', 'you can not review this candidate');
        this.router.navigate([this.role]);
      }
      else {
        if (this.revieweeData.status !== "Pending") {
          this.toast.showWarn('Warning', 'review has been submitted');
          this.router.navigate([this.role]);
        }
      }
      this.canCall = true;
      this.spinner.hide();
    },
      error => {
        this.spinner.hide();
        if (error.error.code === 'NORECORD') {
          this.toast.showError('Error', 'Record for this mapping does not exist')
          this.router.navigate([this.role])
        }
        if (error.error.code === 'JOIFALSE') {
          this.toast.showError('Error', 'Please enter valid mapping id')
          this.router.navigate([this.role])
        }
      })
  }
  @Output() onSubmit(response) {

    let responseObj = Object.assign({
      user_id: this.userId,
      session_template_mapping_id: this.mappingId,
      answer_response: [response]
    });
    this.reviewservice.submitReview(responseObj).subscribe(data => {
      this.toast.showSuccess(
        'Success',
        'review submitted successfully'
      );
      this.router.navigate([this.role]);
      this.spinner.hide();
      this.liveNotification.sendMessage();
    }, error => {
      this.spinner.hide();
      this.toast.showError('Error', 'review could not be submitted');
    })
  }
}
