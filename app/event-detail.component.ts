import { Component, OnInit } from '@angular/core';
import { RouteParams } from '@angular/router-deprecated';
import { HTTP_PROVIDERS }    from '@angular/http';
import { NgForm }    from '@angular/common';

import { Event } from './event';
import { EventService } from './event.service';
import 'rxjs/Rx';
import * as moment from 'moment';

@Component({
	selector: 'my-event-detail',
	templateUrl: 'event-detail.component.pug'
})
export class EventDetailComponent implements OnInit {
	event: Event;
	submitted = false;
	active = true;
	
	
	onSubmit() {
		this.submitted = true;
	}

	get diagnostic() { return JSON.stringify(this.event); }
	
	newEvent() {
		var now = moment();
		this.event = new Event({'title':'Neue Veranstaltung','date':now.toISOString()});
		this.addEvent(this.event.data);
		this.active = false;
		setTimeout(()=> this.active=true, 0);
	}
	
	addEvent(data: Object) {
		if (!data) { return; }
		this.eventService.addEvent(data)
					   .subscribe(
						 event  => this.events.push(event),
						 error =>  this.errorMessage = <any>error);
	}
	
	constructor(private eventService: EventService,
		private routeParams: RouteParams) {
	}
	
	getEvent() {
		let id = +this.routeParams.get('id');
		this.eventService.getEvent(id).subscribe(event => this.event = event, error =>  this.errorMessage = <any>error);
	}

	ngOnInit() {
		this.getEvent();
	}

	goBack() {
		window.history.back();
	}
}