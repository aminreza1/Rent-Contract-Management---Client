import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiSource } from 'src/app/infrastructure/api-source';
import { CreateUserDto, RolesInUserOperationDto } from 'src/app/infrastructure/interfaces/user.interface';
import { HttpService } from 'src/app/infrastructure/services/http.service';
import { MySnackbarService } from 'src/app/infrastructure/services/snackbar.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {

  createUserform: FormGroup;
  roles: RolesInUserOperationDto[]=[];
  isProcessing: boolean = false;
  
  constructor(
    private httpService: HttpService,
    private router: Router,
    private snackbar: MySnackbarService) { }

  ngOnInit(): void {
    this.createUserform = new FormGroup({
      firstName: new FormControl(null),
      lastName: new FormControl(null),
      userName: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
      email: new FormControl(null),
      mobileConfirmed: new FormControl(false),
      emailConfirmed: new FormControl(false),
      isBlock: new FormControl(false),
      mobile: new FormControl(
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern('^[0][9][0-9]{9}$'),
        ])
      ),
      roles: new FormControl(null),
    });

    this.initialRoles();
  }

  public checkError = (controlName: string, errorName: string) => {
    return this.createUserform.controls[controlName].hasError(errorName);
  };

  SaveUser(){
    this.isProcessing = true;
    var model: CreateUserDto = {
      firstName: this.createUserform.value.firstName,
      lastName: this.createUserform.value.lastName,
      isBlock: this.createUserform.value.isBlock,
      email: this.createUserform.value.email,
      emailConfirmed: this.createUserform.value.emailConfirmed,
      mobile:this.createUserform.value.mobile,
      mobileConfirmed:this.createUserform.value.mobileConfirmed,
      password:this.createUserform.value.password,
      userName:this.createUserform.value.userName,
      roles:this.createUserform.value.roles
    };
    this.httpService
      .postSecureDefault(ApiSource._base + ApiSource.userCreate, model)
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

  private initialRoles(){
    this.httpService
    .getSecureDefault<RolesInUserOperationDto[]>(
      ApiSource._base + ApiSource.userRolesForOperation
    )
    .subscribe(
      (resp: RolesInUserOperationDto[]) => {
        this.roles = resp;
      },
      (err: string) => {
        this.snackbar.confirmToast(err);
      }
    );
  }

}
