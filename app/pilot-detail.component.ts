import { Component, OnInit } from '@angular/core';
import { RouteParams } from '@angular/router-deprecated';
import { HTTP_PROVIDERS }    from '@angular/http';

import { Pilot } from './pilot';
import { PilotService } from './pilot.service';
import 'rxjs/Rx';

@Component({
	selector: 'my-pilot-detail',
	templateUrl: 'pilot-detail.component.pug'
})
export class PilotDetailComponent implements OnInit {
	pilot: Pilot;

	constructor(private pilotService: PilotService,
		private routeParams: RouteParams) {
	}
	
	getPilot() {
		let id = +this.routeParams.get('id');
		this.pilotService.getPilot(id).subscribe(pilot => this.pilot = pilot, error =>  this.errorMessage = <any>error);
	}

	ngOnInit() {
		this.getPilot();
	}

	goBack() {
		window.history.back();
	}
}