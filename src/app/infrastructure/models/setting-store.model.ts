import { Direction } from '@angular/cdk/bidi';

export class SettingStoreModel {
  constructor(
    private _theme: string,
    private _currency: string,
    private _direction: Direction,
    private _language: string
  ) {}

  get direction() {
    return this._direction;
  }
  get language() {
    return this._language;
  }
  get currency() {
    return this._currency;
  }
  get theme() {
    return this._theme;
  }
}
