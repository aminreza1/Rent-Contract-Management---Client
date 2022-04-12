import { ComponentType } from "@angular/cdk/portal";
import { Injectable} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { SettingService } from "./setting.service";

@Injectable({ providedIn: 'root' })
export class MyDialogService {
    constructor(private dialog: MatDialog, private settingService :SettingService) { }

    open(component: ComponentType<any>, _width: string, _data : any) {
        return this.dialog.open(component, {
            width: _width,
            direction: this.settingService.direction,
            data: _data,
          });
    }

}