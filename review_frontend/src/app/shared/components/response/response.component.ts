import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToasterService } from '../../services/toaster.service';
import { ResponseService } from '../../services/response.service';
import { constant } from 'src/app/app.const';
import { EncryptionService } from 'src/app/shared/services/encryption.service';
import { ReviewsService } from "src/app/user/services/reviews.service";
import { NgxSpinnerService } from 'ngx-spinner';
import { LivenotificationService } from 'src/app/base/services/livenotification.service';


@Component({
  selector: 'app-response',
  templateUrl: './response.component.html',
  styleUrls: ['./response.component.scss']
})
export class ResponseComponent implements OnInit {

  role: string;
  mappingId: number;
  record: any = {};
  commentData: any = {};
  flag: string = "Submitted";
  imageIcon: any;
  canCallDynamicForm: boolean = false;
  canCallComment: boolean = false;
  user: any;
  editable: boolean = false;
  disabledButton = false;
  public revieweeData: any;
  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private reponseSesvice: ResponseService,
    private encryptionService: EncryptionService,
    private toster: ToasterService,
    public reviewservice: ReviewsService,
    private spinner: NgxSpinnerService,
    private liveNotification: LivenotificationService) {

    this.mappingId = this.activatedRoute.snapshot.params.mappingId;

    let userData = JSON.parse(localStorage.getItem('userdata'));
    this.role = this.encryptionService.get(constant.ENCRYPTIONKEY, userData.role);
    this.user = Number(this.encryptionService.get(constant.ENCRYPTIONKEY, userData.user_id));
  }

  ngOnInit() {
    this.loadRecord();
    this.loadComments();
    this.reviewservice.getRecords(this.mappingId).subscribe(
      data => {
        this.revieweeData = data;
        this.spinner.hide();
      },
      error => { this.spinner.hide(); }
    );
  }
  edit() {
    this.editable = true;
  }
  loadRecord() {
    this.reponseSesvice.getRecords(this.mappingId).subscribe(
      data => {
        this.record = data;
        if (this.record.status === "Pending") {
          this.toster.showWarn("Access Denied", "Review has not been yet filled");
          if (this.role === "ROLE_SADMIN") {
            if (this.router.url.includes("response")) {
              this.router.navigate(["admindashboard"]);
            } else {
              this.router.navigate(["givereview"]);
            }
          } else {
            this.router.navigate(["dashboard"]);
          }
        } else if (this.role !== "ROLE_SADMIN") {
          let reviewerFlag = this.record.secondaryReviewers.some((item) => item == this.user) || this.record.reviewerId === this.user;
          if (this.record.status === "Submitted" && reviewerFlag) {
            this.canCallDynamicForm = true;
          } else if (this.record.status === "Published" && (reviewerFlag || this.record.revieweeId === this.user)) {
            this.canCallDynamicForm = true;
          } else {
            this.toster.showError(
              "Error",
              "Restricted url, you can't see the response"
            );
            this.router.navigate(["dashboard"]);
          }
        } else {
          this.canCallDynamicForm = true;
        }
      },
      error => {
        if (error.error.code === "NORECORD") {
          this.toster.showError("Error", "No record found for this candidate");
        } else {
          this.toster.showError("Access Denied", "Invalid access request");
        }
        if (this.role === "ROLE_SADMIN") {
          if (this.router.url.includes("response")) {
            this.router.navigate(["admindashboard"]);
          } else {
            this.router.navigate(["givereview"]);
          }
        } else {
          this.router.navigate(["dashboard"]);
        }
      }
    );
  }

  onSubmit(flag) {
    this.editable = flag;
    setTimeout(a => this.loadComments(), 500);
  }
  loadComments() {
    this.reponseSesvice.getComments(this.mappingId).subscribe(
      data => {
        this.commentData = {
          "comments": data,
          "commentIndex": -1
        };
        this.canCallComment = true;

      },
      error => {
        if (error.error.code === 'NORECORD') {
          this.commentData = {
            "comments": [],
            "commentIndex": -1
          };
          this.canCallComment = true;
        }
      }
    );
  }

  modifiedCommentsData(commentData: any) {
    this.commentData = commentData;
  }

  Back() {
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

  publish() {
    this.disabledButton = true;
    let updateData = this.commentData.comments.filter(x => { return x.visibility === false });
    let commentId = [];

    updateData.forEach((data) => {
      commentId.push(data.commentId);
    });

    this.reponseSesvice.updateComment(commentId).subscribe(() => {
      this.reponseSesvice.publishreview(this.mappingId, this.user).subscribe(() => {
        this.toster.showSuccess('Success', 'Review published Successfully.');
        if (this.router.url.includes("response")) {
          this.router.navigate(['admindashboard']);
        }
        else {
          this.router.navigate(['givereview']);
        }
      });
      this.spinner.hide();
      this.liveNotification.sendMessage();
    });
  }
}
