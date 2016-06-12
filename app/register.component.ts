import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router-deprecated';
import { HTTP_PROVIDERS }    from '@angular/http';
import { FORM_DIRECTIVES, FormBuilder, Validators, ControlGroup, NgIf } from '@angular/common';

import { AuthService } from './auth.service';
import 'rxjs/Rx';
import { MODAL_DIRECTIVES, ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

@Component({
	selector: 'register',
	templateUrl: 'register.component.pug',
	directives: [FORM_DIRECTIVES, NgIf, MODAL_DIRECTIVES],
	providers: [HTTP_PROVIDERS, ModalComponent]
})
export class RegisterComponent {
	@ViewChild('modal')
	modal: ModalComponent;
	
	constructor(private router: Router) { }
	
	open(){
		console.log(this.modal);
		this.modal.open();
	}
}