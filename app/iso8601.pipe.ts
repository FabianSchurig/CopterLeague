import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({name: 'iso8601ToDate'})
export class Iso8601ToDatePipe implements PipeTransform {
    transform(value: number, args: string[]) : any {
		var date = moment(value).locale('de').fromNow()+' : '+moment(value).locale('de').format('dddd, Do MMMM ');
        return date;
    }
}