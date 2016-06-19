import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';
import { Router, RouteParams, RouteSegment } from '@angular/router-deprecated';
import { HTTP_PROVIDERS }    from '@angular/http';
import { NgForm }    from '@angular/common';

import { Event } from './event';
import { EventService } from './event.service';
import { DatepickerComponent } from './datepicker.component';
import 'rxjs/Rx';
import * as moment from 'moment';

import { Iso8601ToDatePipe } from './iso8601.pipe';

@Component({
	selector: 'my-event-detail',
	templateUrl: 'event-detail.component.pug',
	directives: [ DatepickerComponent ],
	pipes: [Iso8601ToDatePipe]
})
export class EventDetailComponent implements OnInit {
	@Input() event: Event;
	@Output() close = new EventEmitter();
	error: any;
	navigated: false;
	submitted = false;
	active = true;
	isNew = false;
	
	constructor(
		private _routeParams: RouteParams,
		private _eventService: EventService,
		private router: Router){
	}
	
	onDatePicked(date: string){
		console.log(date);
		this.event.data.date = new Date(date).toISOString();
	}
	
	onDeadlinePicked(deadline: string){
		console.log(deadline);
		this.event.data.deadline = new Date(deadline).toISOString();
	}
	
	onSubmit() {
		this.submitted = true;
		this.save();
	}

	get diagnostic() { return JSON.stringify(this.event); }
	
	newEvent() {
		var now = moment();
		this.event = new Event();
		this.event.data = new Object();
		this.event.data.title = 'Neue Veranstaltung';
		this.event.data.date = now.toISOString();
		this.isNew = true;
		this.active = false;
		setTimeout(()=> this.active=true, 0);
	}
	
	getEvent(id: number) {
		this._eventService.getEvent(id).subscribe(event => this.event = event, error =>  this.errorMessage = <any>error);
	}

	ngOnInit() {
		if(this._routeParams.get('id') !== null){
			let id = +this._routeParams.get('id');
			this.navigated = true;
			this._eventService.getEvent(id).subscribe(event => this.event = event, error => this.errorMessage = <any>error);
			this.submitted = true;
		} else {
			this.submitted = false;
			this.newEvent();
		}
	}
	
	save() {
		this._eventService
			.save(this.event)
			.subscribe(event => {
				this.event.data.id = event.data.id;
				this.gotoSaved(this.event.data.id);}
				, error => this.errorMessage = <any>error);
			
	}
	
	gotoSaved(id: number){
		this.router.navigate(['EventDetail', { id: id }]);
	}

	goBack(savedEvent: Event = null) {
		this.close.emit(savedEvent);
		if (this.navigated) {
			window.history.back();
		}
	}
}