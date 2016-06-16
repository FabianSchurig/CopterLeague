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
import { FILE_UPLOAD_DIRECTIVES, FileSelectDirective, FileDropDirective, FileUploader } from 'ng2-file-upload/ng2-file-upload';

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
	
	token: string;

	constructor(
		private pilotService: PilotService,
		private routeParams: RouteParams
	) {
		this.getPilot();
		this.token = localStorage.getItem('token');
		this.uploader.authToken = 'Bearer '+this.token;
		var options:FileUploaderOptions = {};
		options.allowedFileType = 'image';
		//options.queueLimit = 1;
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