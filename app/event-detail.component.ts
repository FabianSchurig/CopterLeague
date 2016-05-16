import { Component, OnInit } from '@angular/core';
import { RouteParams } from '@angular/router-deprecated';
import { HTTP_PROVIDERS }    from '@angular/http';

import { Event } from './event';
import { EventService } from './event.service';
import 'rxjs/Rx';

@Component({
	selector: 'my-event-detail',
	templateUrl: 'event-detail.component.pug'
})
export class EventDetailComponent implements OnInit {
	event: Event;

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