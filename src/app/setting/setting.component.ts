import { Direction } from '@angular/cdk/bidi';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiSource } from '../infrastructure/api-source';
import { SettingDto } from '../infrastructure/interfaces/setting.interface';
import { HttpService } from '../infrastructure/services/http.service';
import { SettingService } from '../infrastructure/services/setting.service';
import { MySnackbarService } from '../infrastructure/services/snackbar.service';
// import { SettingSource } from '../infrastructure/setting-source';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {

  // def_lang = 'en';
  // def_langs = ['en', 'fa'];
  // def_theme = 'dark'
  // def_currency = 'usd'

  def_Setting: SettingDto = {
    theme: 'dark',
    currency: 'usd',
    language: 'en',
    languages: 'en,fa',
  };

  updateSettingform: FormGroup;
  options: SettingDto;
  constructor(
    private httpService : HttpService,
    private snackbar : MySnackbarService,
    private settingService : SettingService) { }

  ngOnInit(): void {
    this.updateSettingform = new FormGroup({
      theme: new FormControl(null),
      language: new FormControl(null),
      currency: new FormControl(null)
    });

    this.httpService
    .getSecureDefault<SettingDto>(
      ApiSource._base + ApiSource.settingList
    )
    .subscribe(
      (resp) => {
        this.options = resp;
        this.updateSettingform = new FormGroup({
          theme: new FormControl(this.options.theme),
          language: new FormControl(this.options.language),
          currency: new FormControl(this.options.currency),
        });

        this.settingService.initialSetting(this.options,false);

      },
      (err: string) => {
        this.snackbar.confirmToast(err);
        this.settingService.initialSetting(this.def_Setting,false);
      }
    );

  }

  UpdateSettings(){
    var model: SettingDto = {
      theme: this.updateSettingform.value.theme,
      currency: this.updateSettingform.value.currency,
      language: this.updateSettingform.value.language,
      languages:""
    };
    this.httpService
      .postSecureDefault(ApiSource._base + ApiSource.settingUpdate, model)
      .subscribe(
        (resp: HttpResponse<any>) => {
          if (resp.status == 204 || resp.status == 200) {
            window.location.reload();
            //this.snackbar.SuccessfullToast();
            //this.router.navigate(['/products']);
          } else
            this.snackbar.confirmToast(
              'Error ' + resp.status + ': When response is ok'
            );
        },
        (err: string) => {
          this.snackbar.confirmToast(err);
        }
      );

    
  }
}
