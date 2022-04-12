import { HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiSource } from 'src/app/infrastructure/api-source';
import {
  RentDto,
  TerminateRentDto,
} from 'src/app/infrastructure/interfaces/rent.interface';
import { MyDialogService } from 'src/app/infrastructure/services/dialog.service';
import { HttpService } from 'src/app/infrastructure/services/http.service';
import { LocalizeService } from 'src/app/infrastructure/services/localize.service';
import { MySnackbarService } from 'src/app/infrastructure/services/snackbar.service';

@Component({
  selector: 'app-update-rent',
  templateUrl: './update-rent.component.html',
  styleUrls: ['./update-rent.component.css'],
})
export class UpdateRentComponent implements OnInit {
  loader: boolean = false;
  rentItemId: number = 0;
  rentItem: RentDto = {} as RentDto;
  terminateContractForm: FormGroup;
  viewError: string;

  rentItemsTableColumns: string[] = [
    '#',
    'productName',
    'priceWhenRenting',
    'unitWhenRenting',
    'priceNow',
    'unitNow',
    'calculatedCost',
    'operations',
  ];

  constructor(
    private httpService: HttpService,
    private route: ActivatedRoute,
    private router: Router,
    private dialogService: MyDialogService,
    private snackbar: MySnackbarService,
    public localService:LocalizeService
  ) {}

  ngOnInit(): void {
    this.terminateContractForm = new FormGroup({
      finalCost: new FormControl(null, Validators.required),
    });

    this.rentItemId = this.route.snapshot.params['id'];
    this.initialContract();
  }
  beforeTerminateContract(): void {
    this.dialogService
      .open(ConfirmTerminateDialogComponent, '500px', {
        submit: false,
        cost: this.terminateContractForm.value.finalCost,
        customer: this.rentItem.customerFullName,
      })
      .afterClosed()
      .subscribe((accepted: Boolean) => {
        if (accepted) this.terminateContract();
      });
  }

  lessThanZero(input: number): boolean {
    return input < 0;
  }

  lessThanZeroSetZero(input: number): number {
    return input >= 0 ? input : 0;
  }

  private terminateContract() {
    this.viewError = '';
    var model: TerminateRentDto = {
      id: this.rentItem.id,
      finalCost: Number(this.terminateContractForm.value.finalCost),
      IsTerminated: true,
    };
    this.httpService
      .postSecureDefault(ApiSource._base + ApiSource.rentTerminate, model)
      .subscribe(
        (resp: HttpResponse<any>) => {
          if (resp.status == 204 || resp.status == 200) {
            this.snackbar.SuccessfullToast();
            this.router.navigate(['/contracts/c-0']);
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
  private initialContract() {
    this.loader = true;
    this.httpService
      .getSecureDefault<RentDto>(
        ApiSource._base + ApiSource.rentItem + this.rentItemId
      )
      .subscribe(
        (resp) => {
          this.rentItem = resp;
          this.loader = false;
        },
        (err: string) => {
          this.loader = false;
          this.snackbar.confirmToast(err);
        }
      );
  }
}

@Component({
  selector: 'confirm-terminate-dialog',
  templateUrl: 'confirm-terminate.dialog.html',
})
export class ConfirmTerminateDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmTerminateDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { submit: boolean; cost: number; customer: string }
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
