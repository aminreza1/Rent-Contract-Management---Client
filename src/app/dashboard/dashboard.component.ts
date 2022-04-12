import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SettingService } from '../infrastructure/services/setting.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  token: string | null;
  private settingSub: Subscription;



  constructor(private settingService: SettingService) { 
    this.settingSub = this.settingService.setting.subscribe((m) => {    });
  }

  changeLang(lang: string) {
    this.settingService.changeLanguage(lang);
  }

  ngOnInit(): void {
    this.token = localStorage.getItem('accessToken') ?? 'Empty';
  }

  ngOnDestroy(): void {
    this.settingSub.unsubscribe();
  }
}
