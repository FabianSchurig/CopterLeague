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
	isNew = false;
	
	
	onSubmit() {
		this.submitted = true;
		if(this.isNew){
			this.addEvent(this.event.data);
			// TODO: route to new event data id
			this.isNew = false;
		}
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
	
	addEvent(data: Object) {
		if (!data) { return; }
		this.eventService.addEvent(data)
						.subscribe(
							event  => this.event.data.id = event.data.id,
							error => this.errorMessage = <any>error);
	}
	
	constructor(private eventService: EventService,
		private routeParams: RouteParams) {
	}
	
	getEventById(id: number){
		this.eventService.getEvent(id).subscribe(event => this.event = event, error =>  this.errorMessage = <any>error);
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