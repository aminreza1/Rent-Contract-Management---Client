import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ApiSource } from '../api-source';
import { LoginDto, TokenDto } from '../interfaces/authentication.interface';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { UserStoreModel } from 'src/app/infrastructure/models/user-store.model';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new BehaviorSubject<UserStoreModel>({} as UserStoreModel);
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  login(userName: string, password: string) {
    var model: LoginDto = {
      userName: userName,
      password: password,
    };
    return this.http
      .post<TokenDto>(ApiSource._base + ApiSource.login, model)
      .pipe(
        catchError(this.handleError),
        tap((respData: TokenDto) => {
          this.handleAuthentication(
            respData.userName,
            respData.userRoles,
            respData.token,
            respData.lifeMinutes
          );
        })
      );
  }

  private handleAuthentication(
    userName: string,
    userRoles: string[],
    token: string,
    lifeMin: number
  ) {
    const expirationDate = new Date(new Date().getTime() + lifeMin * 60 * 1000);
    const user = new UserStoreModel(userName, userRoles, token, expirationDate);
    this.user.next(user);
    this.autoLogout(lifeMin * 60 * 1000); // Send Milisecond

    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorRes: HttpErrorResponse) {
    switch (errorRes.status) {
      case 400:
        return throwError('UserName or password is incorrect.');
      case 404:
        return throwError('UserName or password is incorrect.');
      case 401:
        return throwError('Access denied. The account may have been blocked');
      case 500:
        return throwError('An internal server error occurred.');
      case 0:
        return throwError('Server Unavailable.');
      default:
        console.log(errorRes)
        return throwError('Error '+errorRes.status+': An unknown error occurred. You can check the browser console.');
    }
  }

  autoLogin() {
    let userData: {
      userName: string;
      userRoles: string[];
      _token: string;
      _tokenExpirationDate: string;
    };
    const storedUserData = localStorage.getItem('userData');
    if (!storedUserData) {
      return;
    } else {
      userData = JSON.parse(storedUserData);
    }

    if (!userData) return;

    const loadedUser = new UserStoreModel(
      userData.userName,
      userData.userRoles,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  logout() {
    this.user.next({} as UserStoreModel);
    this.router.navigate(['/login']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }
}
