import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SettingService } from './setting.service';

@Injectable({ providedIn: 'root' })
export class MySnackbarService {

  constructor(
    private snackBar: MatSnackBar,
    private settingService : SettingService) {
    }

  timerToast(message: string, seconds: number) {
    return this.snackBar.open(message, '', {
      duration: seconds * 1000,
      direction: this.settingService.direction,
    });
  }

  dynamicToast(message: string) {
    var timeout = 3000;
    var length = message.length;
    if (length > 20)   
        timeout = (length / 10)*1000;
    
      return this.snackBar.open(message, '', {
        duration: timeout,
        direction: this.settingService.direction,
      });
  }

  confirmToast(message: string) {
    return this.snackBar.open(message, 'Ok', {
      direction: this.settingService.direction,
    });
  }

  SuccessfullToast() {
    return this.snackBar.open('The operation was successful', '', {
      duration: 4000,
      direction: this.settingService.direction,
    });
  }
}
