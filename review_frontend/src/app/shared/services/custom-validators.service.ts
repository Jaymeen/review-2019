import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AbstractControl, AsyncValidatorFn, ValidatorFn, ValidationErrors, FormGroup, FormControl, FormArray } from '@angular/forms';
import { Observable, timer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from './../../../environments/enviroment.dev';

@Injectable({
  providedIn: 'root'
})
export class CustomValidatorsService {

  private url = `${environment.backendEndpoint}/nameValidation`;

  constructor(private http: HttpClient) { }

  textboxValidators(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (String(control.value).trim().length == 0) {
        return Object.assign({ 'dataAbsents': true });
      }
    }
  };

  searchName(name: string, model: string, updateId: number) {
    return timer(1000)
      .pipe(
        switchMap(() => {
          if (name != null)
            return this.http.get<any>(`${this.url}?name=${name}&modelName=${model}&isUpdate=${updateId}`);
        })
      );
  }

  nameValidator(model: string, updateId: number, isUpdate: boolean): AsyncValidatorFn {
    updateId = !isUpdate ? 0 : updateId;
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      return this.searchName(control.value, model, updateId)
        .pipe(
          map(res => {
            if (res) {
              return { 'nameExists': true };
            }
          }),
        );
    };
  }

  //to make all the form fields dirty if it it invalid
  markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }


  //to make all the form fields dirty if it it invalid
  markFormGroupUntouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsUntouched();
      if (control.controls) {
        this.markFormGroupUntouched(control);
      }
    });
  }

  oneCheckboxSelection(): ValidatorFn {
    return (formGroup: FormGroup): { [key: string]: boolean } | null => {
      for (let key in formGroup.controls) {
        if (formGroup.controls.hasOwnProperty(key)) {
          let control: FormControl = <FormControl>formGroup.controls[key];
          if (control.value) {
            return null;
          }
        }
      }
      return { isSelected: true }
    }
  }
}
