import { Component, OnInit, Input } from '@angular/core';
import { RouteParams } from '@angular/router-deprecated';
import { HTTP_PROVIDERS }    from '@angular/http';
import { NgForm }    from '@angular/common';

import { Pilot } from './pilot';
import { PilotService } from './pilot.service';

import { Iso8601ToDatePipe } from './iso8601.pipe';
import { isLoggedin, pilotId } from './is-loggedin';
import 'rxjs/Rx';
import * as moment from 'moment';


@Component({
	selector: 'my-pilot-detail',
	templateUrl: 'pilot-detail.component.pug',
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

	constructor(
		private pilotService: PilotService,
		private routeParams: RouteParams
	) {
		this.getPilot();
	}
	
	getPilot() {
		let id = +this.routeParams.get('id');
		this.pilotService.getPilot(id).subscribe(pilot => {
			this.pilot = pilot;
			if(this.pilot.id == this.id){
				this.active = true;
			}
		}, error =>  this.errorMessage = <any>error);
	}
	
	edit(){
		this.isEditable = true;
		console.log('edit');
	}

	ngOnInit() {	
		this.id = pilotId();	
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
		uPilot.street = this.pilot.street;
		uPilot.plz = this.pilot.plz;
		uPilot.city = this.pilot.city;
		
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