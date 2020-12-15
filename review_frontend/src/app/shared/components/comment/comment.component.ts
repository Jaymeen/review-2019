import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResponseService } from '../../services/response.service';
import { constant } from 'src/app/app.const';
import { EncryptionService } from 'src/app/shared/services/encryption.service';
import { CustomValidatorsService } from '../../services/custom-validators.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LivenotificationService } from 'src/app/base/services/livenotification.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  @Input() mappingId: number;
  @Input() commentData;
  @Input() status: any;
  @Input() reviewee: number;

  @Output() modifiedCommentsData: EventEmitter<any> = new EventEmitter<any>();
  @Output() reloadCommentsData: EventEmitter<any> = new EventEmitter<any>();

  userData: any;
  commentIndex: number = -1;
  commentForm: FormGroup;
  image: string;
  imageIcon: any;
  flag: string = "Submitted";
  submittedComment: boolean = false;
  submittedReply: boolean = false;
  enableButton = true;

  constructor(private formBuilder: FormBuilder,
    private encryptionService: EncryptionService,
    private reponseSesvice: ResponseService,
    private customValidatorService: CustomValidatorsService,
    private spinner: NgxSpinnerService,
    private liveNotification: LivenotificationService) {

    this.userData = JSON.parse(localStorage.getItem('userdata'));
    this.commentForm = this.formBuilder.group({
      comment: ['', [Validators.required, Validators.maxLength(100), this.customValidatorService.textboxValidators()]]
    });
  }

  ngOnInit() {
    this.userData.user_id = Number(this.encryptionService.get(constant.ENCRYPTIONKEY, this.userData.user_id));
    this.userData.role = this.encryptionService.get(constant.ENCRYPTIONKEY, this.userData.role);
    this.userData.full_name = this.encryptionService.get(constant.ENCRYPTIONKEY, this.userData.full_name);
    this.imageIcon = this.userData.full_name.charAt(0);
    this.image = localStorage.getItem('image');
    this.commentIndex = this.commentData.commentIndex;
  }

  commentBox(i = -1) {
    this.submittedComment = false;
    this.submittedReply = false;
    this.commentIndex = this.commentIndex === i ? i : -1;
  }

  get formControls() {
    return this.commentForm.controls.comment;
  }
  changeCommentIndex(i: number) {
    this.commentForm.reset();
    this.submittedComment = false;
    this.submittedReply = false;
    this.commentIndex = this.commentIndex == i ? -1 : i;
  }

  changeVisibility(i: number) {
    this.commentData.comments[i].visibility = !this.commentData.comments[i].visibility;
    this.modifiedCommentsData.emit(this.commentData);
  }

  sendComment(id: number = -1, commentId: number = 0, commentVisibility: boolean = true) {
    this.enableButton = false;
    if (id === -1) {
      this.commentIndex = -1;
      this.submittedComment = true;
      this.submittedReply = false;
    }
    else {
      this.submittedReply = true;
      this.submittedComment = false;
    }
    if (this.commentForm.valid) {
      let data = {
        "comment": this.commentForm.value.comment.trim(),
        "mappingId": this.mappingId,
        "user": this.userData.user_id,
        "parentId": commentId,
        "commentVisibility": commentVisibility
      }

      this.reponseSesvice.sendComment(data).subscribe(
        data => {
          this.commentForm.reset();
          this.submittedReply = false;
          this.submittedComment = false;
          this.commentIndex = -1;
          this.reloadCommentsData.emit();
          this.spinner.hide();
          this.enableButton = true;
          this.liveNotification.sendMessage();
        }, error => {
          this.spinner.hide();
          this.enableButton = true;
        }
      );
      ;
    }
    else {
      this.spinner.hide();
      this.enableButton = true;
      return;
    }
  }
}
