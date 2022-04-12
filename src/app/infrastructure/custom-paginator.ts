import { Injectable, OnDestroy } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SettingService } from './services/setting.service';

@Injectable()
export class MatPaginatorIntlCro extends MatPaginatorIntl implements OnDestroy {

  unsubscribe: Subject<void> = new Subject<void>();
  
  itemsPerPageLabel = 'Items per page';
  nextPageLabel     = 'Next Page';
  previousPageLabel = 'Previous Page';
  page0 = 'Page 0 of ';
  page = 'Page ';
  OF_LABEL = ' of ';

  
  constructor(private translate: TranslateService){
    super(); 
    
    this.translate.onLangChange
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => {
        this.getAndInitTranslations();
      });

    this.getAndInitTranslations();
  }
  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  getAndInitTranslations() {
    this.translate
      .get([
        'Paginators.ItemsPerPage',
        'Paginators.NextPage',
        'Paginators.PreviousPage',
        // 'Paginators.Page',
        // 'Paginators.Page0',
        'Paginators.Of'
      ])
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(translation => {
        this.itemsPerPageLabel = translation['Paginators.ItemsPerPage'];
        this.nextPageLabel = translation['Paginators.NextPage'];
        this.previousPageLabel = translation['Paginators.PreviousPage'];
        // this.page = translation['Paginators.Page'];
        // this.page0 = translation['Paginators.Page0'];
        this.OF_LABEL = translation['Paginators.Of'];
        this.changes.next();
      });
  }

  // getRangeLabel = (page: number, pageSize: number, length: number) => {

  //   if (length === 0 || pageSize === 0) {
  //     return this.page0 + length;
  //   }

  //   length = Math.max(length, 0);
  //   const startIndex = page * pageSize;
  //   // If the start index exceeds the list length, do not try and fix the end index to the end.
  //   const endIndex = startIndex < length ?
  //     Math.min(startIndex + pageSize, length) :
  //     startIndex + pageSize;
  //   return this.page + (startIndex + 1) + ' - ' + endIndex + this.OF_LABEL + length;
  // };

  getRangeLabel = (
    page: number,
    pageSize: number,
    length: number,
  ) => {
    if (length === 0 || pageSize === 0) {
      return `0 ${this.OF_LABEL} ${length}`;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex =
      startIndex < length
        ? Math.min(startIndex + pageSize, length)
        : startIndex + pageSize;
    return `${startIndex + 1} - ${endIndex} ${
      this.OF_LABEL
    } ${length}`;
  };
}