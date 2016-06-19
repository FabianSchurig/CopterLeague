import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit  } from '@angular/core';
import { Router, RouteParams, RouteSegment } from '@angular/router-deprecated';
import { HTTP_PROVIDERS }    from '@angular/http';
import { NgForm }    from '@angular/common';

import { Event } from './event';
import { EventService } from './event.service';
import { DatepickerComponent } from './datepicker.component';
import 'rxjs/Rx';
import * as moment from 'moment';

import { isLoggedin, pilotId }	from './is-loggedin';

import { Iso8601ToDatePipe } from './iso8601.pipe';

@Component({
	selector: 'my-event-detail',
	templateUrl: 'event-detail.component.pug',
	directives: [ DatepickerComponent ],
	pipes: [Iso8601ToDatePipe]
})
export class EventDetailComponent implements OnInit, AfterViewInit {
	@Input() event: Event;
	@Output() close = new EventEmitter();
	error: any;
	navigated: false;
	submitted = false;
	active = true;
	isNew = false;
	isCreator = false;
	
	constructor(
		private _routeParams: RouteParams,
		private _eventService: EventService,
		private router: Router){
	}
	
	onDatePicked(date: string){
		console.log(date);
		this.event.date = new Date(date).toISOString();
	}
	
	onDeadlinePicked(deadline: string){
		console.log(deadline);
		this.event.deadline = new Date(deadline).toISOString();
	}
	
	onSubmit() {
		this.submitted = true;
		this.save();
	}

	get diagnostic() { return JSON.stringify(this.event); }
	
	newEvent() {
		var now = moment();
		this.event = new Event();
		this.event = new Object();
		this.event.title = 'Neue Veranstaltung';
		this.event.date = now.toISOString();
		this.event.id = null;
		this.isNew = true;
		this.active = false;
		setTimeout(()=> this.active=true, 0);
	}
	
	getEvent(id: number) {
		this._eventService.getEvent(id).subscribe(event => this.event = event.data, error =>  this.errorMessage = <any>error);
	}

	ngOnInit() {
		if(this._routeParams.get('id') !== null){
			let id = +this._routeParams.get('id');
			this.navigated = true;
			this.getEvent(id);
			this.submitted = true;
			//Check if current user is creator
		} else {
			this.submitted = false;
			this.newEvent();
			console.log('init')
		}
	}
	
	ngAfterViewInit() {
		console.log('after');
		this.loadPlaces();
	}
	
	save() {
		this._eventService
			.save(this.event)
			.subscribe(event => {
				this.event.id = event.id;
				this.gotoSaved(this.event.id);}
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
	
	loadPlaces(){
		 // Initialize the search box and autocomplete
		let searchBox: any = document.getElementById('search-box');
		console.log(searchBox);
		let options = {
			types: [
			// return only geocoding results, rather than business results.
			'geocode',
			],
			componentRestrictions: { country: 'de' }
		};
		var autocomplete = new google.maps.places.Autocomplete(searchBox, options);

		// Add listener to the place changed event
		autocomplete.addListener('place_changed', () => {
			let place = autocomplete.getPlace();
			let lat = place.geometry.location.lat();
			let lng = place.geometry.location.lng();
			let address = place.formatted_address;
			this.placeChanged(lat, lng, address);
		});
	}
	
	placeChanged(lat: string, lng: string, address: string){
		this.event.location = address;
		this.event.lat = lat;
		this.event.lng = lng;
	}
}