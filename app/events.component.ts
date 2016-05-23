import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router-deprecated';
import { HTTP_PROVIDERS }    from '@angular/http';

import { EventService } from './event.service';
import { EventDetailComponent } from './event-detail.component';
import { Event } from './event';
import 'rxjs/Rx';

import { Iso8601ToDatePipe } from './iso8601.pipe';

@Component({
	selector: 'my-events',
	templateUrl: 'events.component.pug',
	directives: [EventDetailComponent],
	providers: [EventService],
	pipes: [Iso8601ToDatePipe]
})
export class EventsComponent implements OnInit {
	events: Event[];
	selectedEvent: Event;
	newEvent = false;
	
	constructor(private eventService: EventService, private router: Router) { }

	getEvents() {
		this.eventService.getEvents().subscribe(events => this.events = events);
	}
	
	addEvent() {
		this.newEvent = true;
		this.selectedEvent = null;
	}
	
	close(savedEvent: Event){
		this.newEvent = false;
		if (savedEvent) {this.getEvents();}
	}
	
	gotoDetail() {
		this.router.navigate(['EventDetail', { id: this.selectedEvent.id }]);
	}

	ngOnInit() {
		this.getEvents();
	}

	onSelect(event: Event) { 
		this.selectedEvent = event;
		this.newEvent = false;
	}
}
