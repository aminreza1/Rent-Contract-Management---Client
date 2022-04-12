
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'dateLocale' })
export class DateLocale implements PipeTransform {

  transform(geoDate: Date | string,culture:string): string {    
    // var culture = 'en-EN';
    // var lang = document.getElementsByTagName('html')[0].getAttribute('lang');
    // if (lang && lang == 'en') culture = 'en-EN';
    // if (lang && lang == 'fa') culture = 'fa-IR';

    if (geoDate instanceof Date)
      return geoDate.toLocaleString(culture, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    else
      return new Date(geoDate).toLocaleString(culture, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
  }
}
