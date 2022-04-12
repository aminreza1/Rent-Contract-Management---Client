import { AfterContentChecked, AfterContentInit, AfterViewInit, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './infrastructure/services/auth.service';
import { Subscription } from 'rxjs';
import { ConfirmDialogComponent } from './infrastructure/shared-templates/confirm-dialog/confirm.dialog';
import { Direction } from '@angular/cdk/bidi';
import { SettingService } from './infrastructure/services/setting.service';
import { MyDialogService } from './infrastructure/services/dialog.service';
import { HttpService } from './infrastructure/services/http.service';
import { SettingDto } from './infrastructure/interfaces/setting.interface';
import { ApiSource } from './infrastructure/api-source';
import { MySnackbarService } from './infrastructure/services/snackbar.service';
import { MatDrawerMode } from '@angular/material/sidenav';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'MyRentalWebApp';
  token: string | null;
  userName: string | null;
  isLogin: boolean = false;
  private userSub: Subscription;
  private settingSub: Subscription;
  configSuccess = false;
  direction: Direction = 'ltr';
  nightMode = true;
  sidebarOpened = true;
  sidebarMode : MatDrawerMode = 'side';
  sm = 960;
  def_Setting: SettingDto = {
    theme: 'dark',
    currency: 'usd',
    language: 'en',
    languages: 'en',
  };
  //public directionStore: DirectionStoreModel = new DirectionStoreModel('ltr','en');

  constructor(
    private httpService: HttpService,
    private authService: AuthService,
    private dialogService: MyDialogService,
    private router: Router,
    private settingService: SettingService,
    private snackbar: MySnackbarService
  ) {
    this.settingService.initialTranslator();
    this.authService.autoLogin();
    this.updateSetting();
  }


  @HostListener('window:resize', ['$event'])
  onResize() {
    this.sidebarOpened = window.innerWidth > this.sm;
    this.sidebarMode = window.innerWidth > this.sm ? 'side' : 'over';
  }

  ngOnInit(): void {
    this.sidebarOpened = window.innerWidth > this.sm;
    this.sidebarMode = window.innerWidth > this.sm ? 'side' : 'over';

    this.userSub = this.authService.user.subscribe((user) => {
      this.token = user.token;
      this.isLogin = user.isAuth;
      this.userName = user.userName;
    });
    this.settingSub = this.settingService.setting.subscribe((m) => {
      this.direction = m.direction;
    });
  }

  onLogout(): void {
    let logoutTitle = "";
    let logoutMessage = "";

    this.settingService.translateKeys([
        'Dialogs.Logout.Title',
        'Dialogs.Logout.Message'
      ])
      .subscribe(translation => {
        logoutTitle = translation['Dialogs.Logout.Title'];
        logoutMessage = translation['Dialogs.Logout.Message'];
      }); 
    
    const model = {
      title: logoutTitle,
      message: logoutMessage,
      okColor: 'warn',
    };
    this.dialogService
      .open(ConfirmDialogComponent, '400px', model)
      .afterClosed()
      .subscribe((accepted: Boolean) => {
        if (accepted) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
      });
  }

  
  updateSetting() {
    this.httpService
      .get<SettingDto>(ApiSource._base + ApiSource.settingList)
      .subscribe(
        (resp: SettingDto) => {
          this.nightMode = resp.theme == 'dark' ? true : false;
          this.settingService.initialSetting(resp,true);
          this.configSuccess = true;
        },
        (err: string) => {
          this.snackbar.confirmToast(err);
          this.settingService.initialSetting(this.def_Setting,true);
     
        }
      );
      this.hideLoader();
  }
  toggleSidebar() {
    if (this.sidebarOpened) this.sidebarOpened = false;
    else this.sidebarOpened = true;
  }
  goToRoute(newRoute : string){
    if (window.innerWidth <= this.sm) this.sidebarOpened = false;
    this.router.navigate([newRoute]);
  }
  changeLang(lang: string) {
    if(this.configSuccess)
    this.settingService.changeLanguage(lang);
  }
  hideLoader(){
    let element = document.getElementById('app-loading');
    element?.classList.add('loaded');
    setTimeout(() => {
      element?.remove();
    }, 800);
  }
  onSideNavClose(){
     this.sidebarOpened = false;
  }
  onNightMode(){
    this.nightMode = !this.nightMode;

    if(this.nightMode){
      this.settingService.configTheme('light');
      this.nightMode = false;
    }else{
      this.settingService.configTheme('dark');
      this.nightMode = true;
    }
    
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    this.settingSub.unsubscribe();
  }
}
