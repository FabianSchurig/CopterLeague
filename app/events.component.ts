import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router-deprecated';
import { HTTP_PROVIDERS }    from '@angular/http';

import { EventService } from './event.service';
import { EventDetailComponent } from './event-detail.component';
import { Event } from './event';
import 'rxjs/Rx';

@Component({
	selector: 'my-events',
	templateUrl: 'events.component.pug',
	directives: [EventDetailComponent]
	providers: [EventService]
})
export class EventsComponent implements OnInit {
	events: Event[];
	selectedEvent: Event;

	constructor(private eventService: EventService, private router: Router) { }

	getEvents() {
		this.eventService.getEvents().subscribe(events => this.events = events);
	}
	
	gotoDetail() {
		this.router.navigate(['EventDetail', { id: this.selectedEvent.id }]);
	}

	ngOnInit() {
		this.getEvents();
	}

	onSelect(event: Event) { this.selectedEvent = event; }
}
