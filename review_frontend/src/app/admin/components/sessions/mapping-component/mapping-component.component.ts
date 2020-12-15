import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SessionMappingService } from '../../../services/session-mapping.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToasterService } from 'src/app/shared/services/toaster.service';
import { Router, ActivatedRoute } from '@angular/router';
import { constant } from 'src/app/app.const';
import { EncryptionService } from 'src/app/shared/services/encryption.service';
import { TemplateService } from 'src/app/shared/services/template.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LivenotificationService } from 'src/app/base/services/livenotification.service';


interface User {
  user_id: number;
  fullname: string;
}

interface Template {
  value: number;
  label: string;
}

@Component({
  selector: 'app-mapping-component',
  templateUrl: './mapping-component.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./mapping-component.component.scss']
})
export class MappingComponentComponent implements OnInit {

  users: User[];
  reviewees: User[];
  templates: Template[];
  secondaryReviewers: User[];
  members: User[];

  sessionId: number;
  errorMessage: string;
  mappingObject: Object;

  userData;
  userId: number;
  validData = true;
  mappingForm: FormGroup;
  mappingArray = [];
  newTemplate: any;
  disabledButton = false;

  constructor(
    private sessionMappingService: SessionMappingService,
    private fb: FormBuilder,
    private toast: ToasterService,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private encryptionService: EncryptionService,
    private templateService: TemplateService,
    private spinner: NgxSpinnerService,
    private liveNotification: LivenotificationService) { }

  ngOnInit() {
    this.mappingForm = this.fb.group({
      selectedReviewee: ["", Validators.required],
      selectedPrimaryReviewer: ["", Validators.required],
      selectedSecondaryReviewer: [""],
      selectedTemplate: ["", Validators.required]
    });

    this.newTemplate = this.templateService.retriveTemplateIdAndName();

    if (this.newTemplate) {
      this.templates = [];
      this.templates.push(this.newTemplate);
      this.mappingForm.reset();
      this.mappingForm.patchValue({ selectedTemplate: this.templates[0] })
    } else {
      this.mappingForm.reset();
    }

    this.getSessionData();
    this.userData = JSON.parse(localStorage.getItem('userdata'));
    this.userId = this.encryptionService.get(constant.ENCRYPTIONKEY, this.userData.user_id);
  }

  getSessionData() {
    this.sessionId = this.activatedRoute.snapshot.params.sessionId;
  }

  revieweeCSV(reviewees) {
    let revieweeNames = '';
    for (const reviewee of reviewees) {
      revieweeNames = revieweeNames + ', ' + reviewee.reviewee_name;
    }
    revieweeNames = revieweeNames.substr(1);
    return revieweeNames;
  }
  reviewerCSV(reviewers) {
    let reviewerNames = '';
    for (const reviewer of reviewers) {
      reviewerNames = reviewerNames + ', ' + reviewer.reviewer_name;
    }
    reviewerNames = reviewerNames.substr(1);
    return reviewerNames;
  }
  fillMultiSelects(event) {
    if (event.value) {
      this.selectReviewer(event);
      this.selectReviewee(event);
    } else {
      this.secondaryReviewers = [];
      this.reviewees = [];
    }
  }
  selectReviewee(event) {
    if (event.value) {
      this.reviewees = this.members.filter((item) => {
        return item.user_id !== event.value.user_id;
      });

      let selReviewees = this.mappingForm.get('selectedReviewee').value;
      if (selReviewees) {
        selReviewees = selReviewees.filter(
          reviewee => reviewee.user_id !== event.value.user_id);
        this.mappingForm.get('selectedReviewee').setValue(selReviewees);
      }
    } else {
      this.reviewees = [];
      this.mappingForm.controls['selectedReviewee'].reset();
      this.mappingForm.controls['selectedPrimaryReviewer'].markAsDirty();
    }
  }
  selectReviewer(event) {
    if (event.value) {
      this.secondaryReviewers = this.users.filter((item) => {
        return item.user_id !== event.value.user_id;
      });
      let selSecondaryReviewers = this.mappingForm.get('selectedSecondaryReviewer').value;

      if (selSecondaryReviewers) {
        selSecondaryReviewers = selSecondaryReviewers.filter(
          reviewee => reviewee.user_id !== event.value.user_id);
        this.mappingForm.get('selectedSecondaryReviewer').setValue(selSecondaryReviewers);
      }
    }
  }

  updateMultiselect(type) {
    if (type == "reviewee") {
      let selReviewees = this.mappingForm.get('selectedReviewee').value;
      let reviewers = this.mappingForm.get('selectedSecondaryReviewer').value;
      reviewers = reviewers.map(reviewer => {
        return reviewer.user_id;
      })

      if (selReviewees) {
        selReviewees = selReviewees.filter(
          reviewee => !reviewers.includes(reviewee.user_id));
        this.mappingForm.get('selectedReviewee').setValue(selReviewees);
      }
    } else if (type == "reviewer") {
      let selSecondaryReviewers = this.mappingForm.get('selectedSecondaryReviewer').value;
      let reviewees = this.mappingForm.get('selectedReviewee').value;
      reviewees = reviewees.map(reviewee => {
        return reviewee.user_id;
      })

      if (selSecondaryReviewers) {
        selSecondaryReviewers = selSecondaryReviewers.filter(
          reviewer => !reviewees.includes(reviewer.user_id));
        this.mappingForm.get('selectedSecondaryReviewer').setValue(selSecondaryReviewers);
      }
    }
  }
  addDataArray() {
    const revieweeForReviewer = this.mappingForm.value.selectedReviewee.map(
      reviewee => ({
        reviewee_id: Number(reviewee.user_id),
        reviewee_name: reviewee.fullname
      })
    );
    let secondaryReviewers = [];
    if (this.mappingForm.value.selectedSecondaryReviewer) {
      secondaryReviewers = this.mappingForm.value.selectedSecondaryReviewer.map(
        reviewer => ({
          reviewer_id: Number(reviewer.user_id),
          reviewer_name: reviewer.fullname
        })
      );
    }

    this.mappingObject = {
      primaryReviewer: {
        reviewer_id: Number(this.mappingForm.value.selectedPrimaryReviewer.user_id),
        reviewer_name: this.mappingForm.value.selectedPrimaryReviewer.fullname
      },
      secondaryReviewers: secondaryReviewers,
      reviewees: revieweeForReviewer,
      template: {
        template_id: this.mappingForm.value.selectedTemplate.value,
        template_name: this.mappingForm.value.selectedTemplate.label
      }
    };
    this.mappingArray.push(this.mappingObject);
  }

  validMappingData(): boolean {
    if (this.mappingForm.controls['selectedTemplate'].valid &&
      this.mappingForm.controls['selectedReviewee'].valid &&
      this.mappingForm.controls['selectedPrimaryReviewer'].valid
    ) {
      this.validData = true;
      return true;
    } else {
      this.validData = false;
      this.mappingForm.controls['selectedPrimaryReviewer'].markAsDirty();
      this.mappingForm.controls['selectedTemplate'].markAsDirty();
      this.mappingForm.controls['selectedReviewee'].markAsDirty();
      return false;
    }
  }

  addFieldValue() {
    if (this.validMappingData()) {
      this.addDataArray();
      this.mappingForm.reset();
      this.secondaryReviewers = [];
      this.reviewees = [];
    }
  }

  deleteFieldValue(index) {
    this.mappingArray.splice(index, 1);
    if (this.mappingArray.length > 0) {
      this.validData = true;
    } else {
      this.validData = false;
    }
  }

  createTemplate() {
    this.route.navigate(['template'], { queryParams: { comingFromMapping: 1, id: this.sessionId } });
  }

  onCancel() {
    this.route.navigate(['session-mapping-details', this.sessionId]);
  }

  getTemplateNames(dropdown) {
    dropdown.filterValue = null;
    this.sessionMappingService.getTemplates().subscribe(data => {
      this.templates = data;
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
      this.toast.showError('Error', 'Error in Fetching Templates.');
    });
  }

  getUserNames(dropdown) {
    dropdown.filterValue = null;
    this.sessionMappingService.getUsers().subscribe(data => {
      this.users = data[0];
      this.members = data[1];
      this.users.push(...this.members);
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
      this.toast.showError('Error', 'Error in Fetching Candidates');
    });
  }

  filterReviewee(dropdown) {
    dropdown.filterValue = null;
  }

  onSubmit() {
    this.disabledButton = true;
    if (this.mappingForm.valid === false && this.mappingArray.length === 0) {
      this.toast.showError('Error', 'Please select atlease one mapping!');
      this.disabledButton = false;
    }
    else {
      if (this.mappingForm.valid == true) {
        this.addDataArray();
        this.mappingForm.reset();
      }

      this.sessionMappingService.addMappingDetails(this.sessionId, this.userId, this.mappingArray).subscribe(
        data => {
          this.toast.showSuccess('Success', 'Candidate selection saved successfully.');
          this.route.navigate(['session-mapping-details', this.sessionId]);
          this.spinner.hide();
          this.liveNotification.sendMessage();
        },
        error => {
          this.spinner.hide();
          if (error.error.code === 'JOIFALSE') {
            this.errorMessage = 'Session ID must be a number !';
          } else if (error.error.code === 'SIDNOTFOUND') {
            this.errorMessage = error.error.error;
          }
          else if (error.error.code === 'SESSIONNOTACTIVE') {
            this.errorMessage = error.error.error;
          } else {
            this.errorMessage = 'Invalid data !';
          }
          this.toast.showError('Error', this.errorMessage);
        });

      this.mappingArray = [];
    }
  }

  ngOnDestroy() {
    this.templateService.storeTemplateIdAndName(null);
  }
}
