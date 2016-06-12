import { Component, OnInit, Output, EventEmitter, ViewChild  } from '@angular/core';
import { Router, RouteParams, RouteSegment } from '@angular/router-deprecated';
import { HTTP_PROVIDERS }    from '@angular/http';
import { FORM_DIRECTIVES, FormBuilder, Validators, ControlGroup, NgIf, NgForm } from '@angular/common';

import { AuthService } from './auth.service';
import { PilotService } from './pilot.service';
import { Pilot } from './pilot';
import 'rxjs/Rx';
import { MODAL_DIRECTIVES, ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { isLoggedin } from './is-loggedin'

@Component({
	selector: 'register',
	templateUrl: 'register.component.pug',
	directives: [FORM_DIRECTIVES, NgIf, MODAL_DIRECTIVES],
	providers: [HTTP_PROVIDERS, ModalComponent, PilotService, AuthService]
})
export class RegisterComponent implements OnInit {
	pilot: Pilot;
	@ViewChild('modal')
	modal: ModalComponent;
	errorMessage: string;
	loggedIn: boolean;
	
	constructor(private router: Router, private pilotService: PilotService) { 
		this.loggedIn = !!localStorage.getItem('token');
	}
	
	open(){
		this.modal.open();
	}
	
	close() {
        this.modal.close();
    }
	
	ngOnInit() {
		this.newPilot();
	}
	
	newPilot(){
		this.pilot = new Pilot();
		this.pilot.alias = "";
		this.pilot.password = "";
		this.pilot.email = "";
		this.pilot.firstName = "";
		this.pilot.familyName = "";
	}
	
	onSubmit():void {
		console.log(this.pilot);
		this.pilotService.register(this.pilot).subscribe((result) => {
			if (result) {
				this.router.navigate(['PilotDetail', { id: result.data.id }]);
				this.close();
			}
		} , () => { this.error = true; } );
	}
}