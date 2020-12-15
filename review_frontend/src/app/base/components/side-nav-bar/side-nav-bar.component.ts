import { BaseService } from './../../services/base.service';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { constant } from '../../../app.const';
import { EncryptionService } from 'src/app/shared/services/encryption.service';

@Component({
  selector: 'app-side-nav-bar',
  templateUrl: './side-nav-bar.component.html',
  styleUrls: ['./side-nav-bar.component.scss']
})
export class SideNavBarComponent implements OnInit {
  @Input() sidebar;

  public show = true;
  public selectedItem: Number = 1;
  public role;
  public wrapper = true;
  sidebarOpened = true;
  subscription: Subscription;
  userData;
  image: string;
  imageIcon: any;

  constructor(private router: Router,
    private baseService: BaseService,
    private encryptionService: EncryptionService) { }

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem('userdata'));
    this.userData.full_name = this.encryptionService.get(constant.ENCRYPTIONKEY, this.userData.full_name);
    this.imageIcon = this.userData.full_name.charAt(0);
    this.image = localStorage.getItem('image');
    
    if (JSON.parse(localStorage.getItem('userdata'))) {
      this.userData.role = this.encryptionService.get(constant.ENCRYPTIONKEY, this.userData.role);
      if (this.userData.role === 'ROLE_SADMIN') {
        this.show = true;
      } else if (this.userData.role === 'ROLE_MEMBER') {
        this.show = false;
      }
    } else {
      this.router.navigate(['/login']);
    }

    this.setSidebar();
    this.selectSidebar();
  }

  setSidebar() {
    this.subscription = this.baseService.clickBehaviourSubject.subscribe(data => {
      this.sidebarOpened = data;
    });
  }

  toggleactiveMenu(i) {
    this.selectedItem = i;
  }

  selectSidebar() {
    this.baseService.changeOfRoutesBehaviourSubject.subscribe(currentUrl => {
      if (this.show) {
        if (currentUrl === "/admindashboard" || currentUrl.includes('/response')) {
          this.selectedItem = 1;
        } else if (currentUrl === "/list-sessions" || currentUrl.includes("/session-details") ||
          currentUrl.includes("/session-mapping") || currentUrl.includes("/session-mapping-details")) {
          this.selectedItem = 2;
        } else if (currentUrl === "/list-templates" || currentUrl.includes("/editTemplate") ||
          currentUrl.includes("/preview") || currentUrl === "/template") {
          this.selectedItem = 3;
        }
        else if (currentUrl === "/givereview" || currentUrl.includes('/myreview') ||
          currentUrl.includes('/review')) {
          this.selectedItem = 4;
        }
      }
      else {
        if (currentUrl === "/dashboard" || currentUrl.includes('/myreview') ||
          currentUrl.includes('/review')) {
          this.selectedItem = 1;
        }
        else if (currentUrl === "/analysis") {
          this.selectedItem = 2;
        }
      }
    });
  }

  navigateToAdminDashboard() {
    this.router.navigate(['/admindashboard']);
  }

  navigateToListSessions() {
    this.router.navigate(['/list-sessions']);
  }

  navigateToTemplate() {
    this.router.navigate(['/list-templates']);
  }

  navigateToUserDashboard() {
    this.router.navigate(['/dashboard']);
  }

  navigateToGiveReview() {
    this.router.navigate(['/givereview']);
  }

  navigateToReviewAnalysis() {
    this.router.navigate(['/analysis']);
  }

  navigateToReEvaluation() { }

}