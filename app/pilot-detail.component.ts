import { Component, OnInit, Input } from '@angular/core';
import { RouteParams } from '@angular/router-deprecated';
import { HTTP_PROVIDERS }		from '@angular/http';
import { NgForm }		from '@angular/common';

import { Pilot } from './pilot';
import { PilotService } from './pilot.service';

import { Iso8601ToDatePipe } from './iso8601.pipe';
import { isLoggedin, pilotId } from './is-loggedin';
import 'rxjs/Rx';
import * as moment from 'moment';
import { FILE_UPLOAD_DIRECTIVES, FileSelectDirective, FileDropDirective, FileUploader } from 'ng2-file-upload/ng2-file-upload';

declare var google: any;

@Component({
	selector: 'my-pilot-detail',
	templateUrl: 'pilot-detail.component.pug',
	directives: [FILE_UPLOAD_DIRECTIVES],
	pipes: [Iso8601ToDatePipe]
})
export class PilotDetailComponent implements OnInit {
	pilot: Pilot;
	error = false;
	submitted = false;
	@Input() loggedIn;
	id: number = pilotId();
	isEditable= false;
	active = false;
	errorMessage = '';
	pilotAPI = '';
	public uploader:FileUploader = new FileUploader({url: '/api/pilot/'+this.routeParams.get('id')+'/avatar'});
	
	public address: Object;
	
	token: string;

	constructor(
		private pilotService: PilotService,
		private routeParams: RouteParams
	) {
		this.getPilot();
		this.token = localStorage.getItem('token');
		var options:FileUploaderOptions = {};
		options.allowedFileType = 'image';
		options.authToken = 'Bearer '+this.token;
		this.uploader.setOptions(options);
	}
	
	uploadLast(){
		var num:number = this.uploader.queue.length - 1;
		//console.log(num);
		this.uploader.uploadItem(this.uploader.queue[num]);
	}
	
	getPilot() {
		let id = +this.routeParams.get('id');
		this.pilotService.getPilot(id).subscribe(pilot => {
			this.pilot = pilot;
			if(this.pilot.id == this.id){
				this.active = true;
			}
		}, error =>	this.errorMessage = <any>error);
	}
	
	edit(){
		this.isEditable = true;
		console.log('edit');
	}

	ngOnInit() {	
		this.id = pilotId();	
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
		this.pilot.formatted_address = address;
		this.pilot.lat = lat;
		this.pilot.lng = lng;
	}
	
	onSubmit() {
		var uPilot = new Pilot();
		uPilot.alias = this.pilot.alias;
		uPilot.firstName = this.pilot.firstName;
		uPilot.familyName = this.pilot.familyName;
		uPilot.email = this.pilot.email;
		uPilot.telephone = this.pilot.telephone;
		uPilot.notes = this.pilot.notes;
		uPilot.id = this.pilot.id;
		uPilot.formatted_address = this.pilot.formatted_address;
		uPilot.lat = this.pilot.lat;
		uPilot.lng = this.pilot.lng;
		
		this.pilotService
			.updatePilot(uPilot)
			.subscribe(pilot => {
				//this.pilot = pilot;
				this.isEditable = false;
				}
				, error => this.errorMessage = <any>error);
	}

	goBack() {
		window.history.back();
	}
}