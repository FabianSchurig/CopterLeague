import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router-deprecated';
import { HTTP_PROVIDERS }    from '@angular/http';

import { PilotService } from './pilot.service';
import { PilotDetailComponent } from './pilot-detail.component';
import { Pilot } from './pilot';
import 'rxjs/Rx';

@Component({
	selector: 'my-pilots',
	templateUrl: 'pilots.component.pug',
	directives: [PilotDetailComponent],
	providers: [PilotService]
})
export class PilotsComponent implements OnInit {
	pilots: Pilot[];
	selectedPilot: Pilot;

	constructor(private pilotService: PilotService, private router: Router) { }

	getPilots() {
		this.pilotService.getPilots().subscribe(pilots => this.pilots = pilots);
	}
	
	gotoDetail() {
		this.router.navigate(['PilotDetail', { id: this.selectedPilot.id }]);
	}

	ngOnInit() {
		this.getPilots();
	}

	onSelect(pilot: Pilot) { this.selectedPilot = pilot; }
}
