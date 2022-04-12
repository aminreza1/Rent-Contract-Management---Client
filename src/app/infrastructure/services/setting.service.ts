import { Direction } from '@angular/cdk/bidi';
import { Injectable } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SettingDto } from '../interfaces/setting.interface';
import { SettingStoreModel } from '../models/setting-store.model';

@Injectable()
export class SettingService {
  setting = new BehaviorSubject<SettingStoreModel>({} as SettingStoreModel);
  public language: string = 'en';
  public direction: Direction = 'ltr';
  public languages: string[] = ['en'];
  public theme: string = 'dark';
  public currency: string = 'usd';
  unsubscribe: Subject<void> = new Subject<void>();

  constructor(private translate: TranslateService) {}

  initialTranslator() {
    this.translate.addLangs(this.languages);
    this.translate.setDefaultLang(this.language);
    this.translate.use(this.language);
  }

  initialSetting(setting: SettingDto, initialTime: boolean) {
    var languages = setting.languages.split(',');

    if (initialTime) {
      this.translate.addLangs(languages);
      this.translate.setDefaultLang(setting.language);
    }


    this.translate.use(setting.language);

    this.configTheme(setting.theme);

    this.language = setting.language;
    this.languages = languages;
    this.theme = setting.theme;
    this.currency = setting.currency;


    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      const _direction =
        event.lang == 'fa' || event.lang == 'ar' ? 'rtl' : 'ltr';
      this.direction = _direction;

      const dir = new SettingStoreModel(
        setting.theme,
        'usd',
        _direction,
        event.lang
      );
      this.setting.next(dir);
      document.getElementsByTagName('html')[0].setAttribute('dir', _direction);
      document.getElementsByTagName('html')[0].setAttribute('lang', event.lang);
    });
  }

  configTheme(theme: string) {
    const body = document.getElementsByTagName('body')[0];
    body.className = '';
    if (theme == 'dark') body.classList.add('theme-dark');

    if (theme == 'light') body.classList.add('theme-light');
  }

  htmlDirection(): Direction {
    return (document.getElementsByTagName('html')[0].getAttribute('dir') ??
      'ltr') as Direction;
  }

  changeLanguage(lang: string) {
    this.translate.use(lang);
  }

  translateKey(key: string) {
    return this.translate.get(key);
  }
  subscribedTranslateKey(key: string): string {
    let result: string = '';
    this.translate.get(key).subscribe((resp: string) => {
      result = resp;
    });
    return result;
  }
  translateKeys(keys: string[]) {
    return this.translate.get(keys).pipe(takeUntil(this.unsubscribe));
  }
}
