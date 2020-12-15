import { Injectable } from '@angular/core';
import { EncryptionService } from 'src/app/shared/services/encryption.service';
import { constant } from 'src/app/app.const';

@Injectable({
  providedIn: 'root'
})
export class GetUserRoleService {
  constructor(private encryptedService: EncryptionService) { }


  getUserRole() {
    const userData = JSON.parse(localStorage.getItem('userdata'));
    userData.role = this.encryptedService.get(
      constant.ENCRYPTIONKEY,
      userData.role
    );
    return userData.role;
  }
}
