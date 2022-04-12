import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiSource } from 'src/app/infrastructure/api-source';
import {
  RolesInUserOperationDto,
  UpdateUserDto,
} from 'src/app/infrastructure/interfaces/user.interface';
import { HttpService } from 'src/app/infrastructure/services/http.service';
import { MySnackbarService } from 'src/app/infrastructure/services/snackbar.service';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css'],
})
export class UpdateUserComponent implements OnInit {
  UpdateUserform: FormGroup;
  roles: RolesInUserOperationDto[] = [];
  user: UpdateUserDto;
  isProcessing: boolean = false;
  userName: string = '';

  constructor(
    private httpService: HttpService,
    private route: ActivatedRoute,
    private router: Router,
    private snackbar: MySnackbarService
  ) {}

  ngOnInit(): void {
    this.userName = this.route.snapshot.params['userName'];

    this.UpdateUserform = new FormGroup({
      firstName: new FormControl(null),
      lastName: new FormControl(null),
      userName: new FormControl(null, Validators.required),
      password: new FormControl(null),
      email: new FormControl(null),
      mobileConfirmed: new FormControl(false),
      emailConfirmed: new FormControl(false),
      isBlock: new FormControl(false),
      changeForcePassword: new FormControl(false),
      mobile: new FormControl(
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern('^[0][9][0-9]{9}$'),
        ])
      ),
      roles: new FormControl(null),
    });

    if (this.userName) this.initialRolesAndUser(this.userName);
  }

  public checkError = (controlName: string, errorName: string) => {
    return this.UpdateUserform.controls[controlName].hasError(errorName);
  };

  onChangeForcePassword() {
    if (this.UpdateUserform.value.changeForcePassword)
      this.UpdateUserform.controls['changeForcePassword'].addValidators(
        Validators.required
      );
    else
      this.UpdateUserform.controls['changeForcePassword'].clearValidators();
  }
  SaveChanges() {
    this.isProcessing = true;
    var model: UpdateUserDto = {
      id: this.user.id,
      firstName: this.UpdateUserform.value.firstName,
      lastName: this.UpdateUserform.value.lastName,
      isBlock: this.UpdateUserform.value.isBlock,
      email: this.UpdateUserform.value.email,
      emailConfirmed: this.UpdateUserform.value.emailConfirmed,
      mobile: this.UpdateUserform.value.mobile,
      mobileConfirmed: this.UpdateUserform.value.mobileConfirmed,
      changeForcePassword: this.UpdateUserform.value.changeForcePassword,
      password: this.UpdateUserform.value.password,
      userName: this.UpdateUserform.value.userName,
      roles: this.UpdateUserform.value.roles,
    };

    this.httpService
      .postSecureDefault(ApiSource._base + ApiSource.userUpdate, model)
      .subscribe(
        (resp: HttpResponse<any>) => {
          if (resp.status == 204 || resp.status == 200) {
            this.snackbar.SuccessfullToast();
            this.router.navigate(['/users']);
          } else
            this.snackbar.confirmToast(
              'Error ' + resp.status + ': When response is ok'
            );
          this.isProcessing = false;
        },
        (err: string) => {
          this.snackbar.confirmToast(err);
          this.isProcessing = false;
        }
      );
  }

  private initialRolesAndUser(user: string) {
    this.httpService
      .getSecureDefault<RolesInUserOperationDto[]>(
        ApiSource._base + ApiSource.userRolesForOperation
      )
      .subscribe(
        (resp: RolesInUserOperationDto[]) => {
          this.roles = resp;
          this.initialUser(user);
        },
        (err: string) => {
          this.snackbar.confirmToast(err);
          this.initialUser(user);
        }
      );
  }

  private initialUser(user: string) {
    this.httpService
      .getSecureDefault<UpdateUserDto>(
        ApiSource._base + ApiSource.userItem + user
      )
      .subscribe(
        (resp: UpdateUserDto) => {
          this.user = resp;
          this.UpdateUserform.controls['firstName'].setValue(resp.firstName);
          this.UpdateUserform.controls['lastName'].setValue(resp.lastName);
          this.UpdateUserform.controls['userName'].setValue(resp.userName);
          this.UpdateUserform.controls['email'].setValue(resp.email);
          this.UpdateUserform.controls['mobile'].setValue(resp.mobile);
          this.UpdateUserform.controls['mobileConfirmed'].setValue(
            resp.mobileConfirmed
          );
          this.UpdateUserform.controls['emailConfirmed'].setValue(
            resp.emailConfirmed
          );
          this.UpdateUserform.controls['isBlock'].setValue(resp.isBlock);
          this.UpdateUserform.controls['changeForcePassword'].setValue(
            resp.changeForcePassword
          );
          this.UpdateUserform.controls['roles'].setValue(resp.roles);
        },
        (err: string) => {
          this.snackbar.confirmToast(err);
        }
      );
  }
}
