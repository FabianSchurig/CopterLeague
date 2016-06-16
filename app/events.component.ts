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
	offset: number = 0;
	
	constructor(private eventService: EventService, private router: Router) {
	}

	getEvents() {
		this.eventService.getEvents().subscribe(events => {
			this.events = events.data;
		});
	}
	
	getEventsByOffset(offset: number){
		this.eventService.getEventsByOffset(offset).subscribe(events => {
				this.events = this.events.concat(events.data);
		});
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
	
	getLocationLink(event: Event){
		return "https://maps.googleapis.com/maps/api/staticmap?center="+ event.location +"&zoom=15&size=500x300&key=AIzaSyDv8f6roSx7xY5FS-Xb4tjTkGgG5PD9g00";
	}

	ngOnInit() {
		this.getEvents();
	}

	onSelect(event: Event) { 
		this.selectedEvent = event;
		this.newEvent = false;
	}
	
	scrollListener(){
		var a = document.body.scrollTop;
		var b = document.body.scrollHeight - document.body.clientHeight;
		var c = a/b;
		if(c == 1){
			if(this.offset < this.events.length - 9){
				this.offset = this.events.length;
				this.getEventsByOffset(this.offset);
			}
			
		}
		//console.log(this.events);
	}
}
