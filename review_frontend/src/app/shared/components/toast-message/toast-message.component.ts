import { ToasterService } from './../../services/toaster.service';
import { Component, OnInit } from "@angular/core";


@Component({
  selector: 'app-toast-message',
  templateUrl: './toast-message.component.html',
  styleUrls: ['./toast-message.component.scss']
})
export class ToastMessageComponent implements OnInit {
  constructor(public toast: ToasterService) { }

  ngOnInit() { }

}

