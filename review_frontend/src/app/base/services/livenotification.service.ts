import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LivenotificationService {

  private url = 'http://localhost:3001';
  private socket;

  constructor() {
    this.socket = io(this.url);
  }

  public sendMessage() {
    this.socket.emit('new-message', 'reload');
  }


  public callNotificationApi = () => {
    return Observable.create((observer) => {
      this.socket.on('new-message', (message) => {
        observer.next(message);
      });
    });
  }
}
