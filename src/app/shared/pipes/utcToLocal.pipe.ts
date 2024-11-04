import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment-timezone';

@Pipe({
  name: 'utcToLocal'
})
export class UtcToLocalPipe implements PipeTransform {

  transform(value: string, format: string = 'YYYY-MM-DD HH:mm:ss'): string {
    if (!value) {
      return '';
    }

    const userTimeZone = moment.tz.guess();
    return moment.utc(value).tz(userTimeZone).format(format);
  }

}
