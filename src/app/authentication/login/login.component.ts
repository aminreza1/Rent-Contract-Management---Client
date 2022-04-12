import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TokenDto } from 'src/app/infrastructure/interfaces/authentication.interface';
import { UserStoreModel } from '../../infrastructure/models/user-store.model';
import { Observable, Subject } from 'rxjs';
import { AuthService } from 'src/app/infrastructure/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  passwordHide: boolean = true;
  loader: boolean = false;
  viewError: string = '';

  user = new Subject<UserStoreModel>();

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      userName: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
    });
  }

  Login() {
    let authObs: Observable<TokenDto>;

    this.viewError = '';
    this.loader = true;

    authObs = this.authService.login(
      this.loginForm.value.userName,
      this.loginForm.value.password
    );

    authObs.subscribe(
      () => {
        this.router.navigate(['/']);
        this.loader = false;
      },
      (message: string) => {
        this.viewError =  message;
        this.loader = false;
      },
      () => {
        this.loader = false;
      }
    );
  }
}
