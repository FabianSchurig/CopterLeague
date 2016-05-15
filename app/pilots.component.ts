import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router-deprecated';
import { PilotService } from './pilot.service';
import { Pilot } from './pilot';

@Component({
	selector: 'my-pilots',
	templateUrl: 'pilots.component.pug'
})
export class PilotsComponent implements OnInit {
	pilots: Pilot[];
	selectedPilot: Pilot;

	constructor(private pilotService: PilotService, private router: Router) { }

	getPilots() {
		this.pilotService.getPilots().then(pilots => this.pilots = pilots);
	}

	ngOnInit() {
		this.getPilots();
	}

	onSelect(pilot: Pilot) { this.selectedPilot = pilot; }
}