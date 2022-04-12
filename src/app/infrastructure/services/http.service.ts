import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Subscription, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserStoreModel } from 'src/app/infrastructure/models/user-store.model';
import { AuthService } from 'src/app/infrastructure/services/auth.service';
import { SettingService } from './setting.service';

@Injectable()
export class HttpService implements OnDestroy {
  token: string | null;
  user = new BehaviorSubject<UserStoreModel>({} as UserStoreModel);
  private userSub: Subscription;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private settingService: SettingService,
    private translate: TranslateService
  ) {
    this.userSub = this.authService.user.subscribe((user) => {
      this.token = user.token;
    });
  }

  // ngOnInit(): void {

  // }
  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  // GET ///////////////////
  ///////////////////////////

  get<T>(url: string) {
    return this.http.get<T>(url).pipe(
      map((resp: any) => {
        return resp;
      }),
      catchError((errRes: HttpErrorResponse) => {
        var message = 'Unknown Error';
        var key = this.handleError(errRes.status);
        const titleSub = this.settingService.translateKey(key);
        titleSub.subscribe((res: string) => {
          message = res;
        });
        return throwError(message);
      })
    );
  }
  getSecure<T>(url: string) {
    return this.http
      .get<T>(url, {
        headers: new HttpHeaders({ Authorization: 'Bearer ' + this.token }),
      })
      .pipe(
        map((resp: any) => {
          return resp;
        }),
        catchError((errRes: HttpErrorResponse) => {
          var message = 'Unknown Error';
          var key = this.handleError(errRes.status);
          const titleSub = this.settingService.translateKey(key);
          titleSub.subscribe((res: string) => {
            message = res;
          });
          return throwError(message);
        })
      );
  }
  getSecureDefault<T>(url: string) {
    return this.http
      .get<T>(url, {
        headers: new HttpHeaders({ Authorization: 'Bearer ' + this.token }),
      })
      .pipe(
        map((resp: any) => {
          return resp;
        }),
        catchError((errRes: HttpErrorResponse) => {
          var message = 'Unknown Error';
          var key = this.handleError(errRes.status);
          const titleSub = this.settingService.translateKey(key);
          titleSub.subscribe((res: string) => {
            message = res;
          });
          return throwError(message);
        })
      );
  }

  // POST //////////////////////////
  ////////////////////////////////

  post<T>(url: string, model: any) {
    return this.http
      .post<T>(url, model, {
        observe: 'response',
      })
      .pipe(
        map((resp) => {
          return resp;
        }),
        catchError((errRes: HttpErrorResponse) => {
          var message = 'Unknown Error';
          var key = this.handleError(errRes.status);
          const titleSub = this.settingService.translateKey(key);
          titleSub.subscribe((res: string) => {
            message = res;
          });
          return throwError(message);
        })
      );
  }
  postSecure<T>(url: string, model: any) {
    return this.http
      .post<T>(url, model, {
        headers: new HttpHeaders({ Authorization: 'Bearer ' + this.token }),
        observe: 'response',
      })
      .pipe(
        map((resp) => {
          return resp;
        }),
        catchError((errRes: HttpErrorResponse) => {
          var message = 'Unknown Error';
          var key = this.handleError(errRes.status);
          const titleSub = this.settingService.translateKey(key);
          titleSub.subscribe((res: string) => {
            message = res;
          });
          return throwError(message);
        })
      );
  }

  postSecureDefault<T>(url: string, model: any) {
    return this.http
      .post<T>(url, model, {
        headers: new HttpHeaders({ Authorization: 'Bearer ' + this.token }),
        observe: 'response',
      })
      .pipe(
        map((resp: any) => {
          console.log(resp);
          return resp;
        }),
        catchError((errRes: HttpErrorResponse) => {
          var message = 'Unknown Error';
          var key = this.handleError(errRes.status);
          const titleSub = this.settingService.translateKey(key);
          titleSub.subscribe((res: string) => {
            message = res;
          });
          return throwError(message);
        })
      );
  }

  private handleError(errorNumber: number): string {
    switch (errorNumber) {
      case 400:
        return 'Errors.E400';
      case 404:
        return 'Errors.E404';
      case 401:
        return 'Errors.E401';
      case 403:
        return 'Errors.E403';
      case 500:
        return 'Errors.E500';
      default:
        return 'Errors.Default';
    }
  }
}
