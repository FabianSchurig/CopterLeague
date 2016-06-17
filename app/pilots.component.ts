import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router-deprecated';
import { HTTP_PROVIDERS }    from '@angular/http';

import { PilotService } from './pilot.service';
import { PilotDetailComponent } from './pilot-detail.component';
import { Pilot } from './pilot';
import 'rxjs/Rx';

import { Iso8601ToDatePipe } from './iso8601.pipe';

@Component({
	selector: 'my-pilots',
	templateUrl: 'pilots.component.pug',
	directives: [PilotDetailComponent],
	providers: [PilotService],
	pipes: [Iso8601ToDatePipe]
})
export class PilotsComponent implements OnInit {
	pilots: Pilot[];
	selectedPilot: Pilot;

	constructor(private pilotService: PilotService, private router: Router) { }
	
	getPilots() {
		this.pilotService.getPilots().subscribe(pilots => {
			this.pilots = pilots.data; 
		});
	}
	
	gotoDetail() {
		this.router.navigate(['PilotDetail', { id: this.selectedPilot.id }]);
	}

	ngOnInit() {
		this.getPilots();
	}

	onSelect(pilot: Pilot) { this.selectedPilot = pilot; }
}
