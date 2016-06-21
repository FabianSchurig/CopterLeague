import { Component, EventEmitter, Output } from '@angular/core';
import { CORE_DIRECTIVES, FORM_DIRECTIVES } from '@angular/common';

import * as moment from 'moment';
import { DATEPICKER_DIRECTIVES, TimepickerComponent } from 'ng2-bootstrap';

@Component({
	selector: 'datepicker',
	templateUrl: 'datepicker.html',
	directives: [DATEPICKER_DIRECTIVES, CORE_DIRECTIVES, FORM_DIRECTIVES, TimepickerComponent]
})
export class DatepickerComponent {
	@Output() onDatePicked = new EventEmitter<Date>();
	
	public hstep:number = 1;
	public mstep:number = 15;
	public ismeridian:boolean = false;

	public mytime:Date = new Date();
	public options:any = {
		hstep: [1, 2, 3],
		mstep: [1, 5, 10, 15, 25, 30]
	};
	
	public dt:Date = new Date();
	public minDate:Date = void 0;
	public events:Array<any>;
	public tomorrow:Date;
	public afterTomorrow:Date;
	public formats:Array<string> = ['DD-MM-YYYY', 'YYYY/MM/DD', 'DD.MM.YYYY', 'shortDate'];
	public format:string = this.formats[0];
	public dateOptions:any = {
		formatYear: 'YY',
		startingDay: 1
	};
	private opened:boolean = false;

	public constructor() {
		(this.tomorrow = new Date()).setDate(this.tomorrow.getDate() + 1);
		(this.afterTomorrow = new Date()).setDate(this.tomorrow.getDate() + 2);
		(this.minDate = new Date()).setDate(this.minDate.getDate());
		this.events = [
			{date: this.tomorrow, status: 'full'},
			{date: this.afterTomorrow, status: 'partially'}
		];
	}	
	public emitDate(){
		this.dt.setHours(this.mytime.getHours());
		this.dt.setMinutes(this.mytime.getMinutes());
		this.onDatePicked.emit(this.dt && this.dt.getTime() || new Date().getTime());
	}
	public getDate():number {
		return this.dt && this.dt.getTime() || new Date().getTime();
	}
	public today():void {
		this.dt = new Date();
	}

	// todo: implement custom class cases
	public getDayClass(date:any, mode:string):string {
		if (mode === 'day') {
			let dayToCheck = new Date(date).setHours(0, 0, 0, 0);

			for (let i = 0; i < this.events.length; i++) {
				let currentDay = new Date(this.events[i].date).setHours(0, 0, 0, 0);

				if (dayToCheck === currentDay) {
					return this.events[i].status;
				}
			}
		}

		return '';
	}

	public disabled(date:Date, mode:string):boolean {
		return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
	}

	public open():void {
		this.opened = !this.opened;
	}

	public clear():void {
		this.dt = void 0;
		this.mytime = void 0;
	}

	public toggleMin():void {
		this.dt = new Date(this.minDate.valueOf());
	}
	
	// Timepicker functions
	public toggleMode():void {
		this.ismeridian = !this.ismeridian;
	};

	public update():void {
		let d = new Date();
		d.setHours(14);
		d.setMinutes(0);
		this.mytime = d;
	};

	public changed():void {
		console.log('Time changed to: ' + this.mytime);
	};
}