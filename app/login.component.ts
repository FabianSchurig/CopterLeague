import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router-deprecated';
import { HTTP_PROVIDERS }    from '@angular/http';
import { FORM_DIRECTIVES, FormBuilder, Validators, ControlGroup, NgIf } from '@angular/common';

import { AuthService } from './auth.service';
import { isLoggedin, pilotId } from './is-loggedin';
import 'rxjs/Rx';


@Component({
	selector: 'login',
	templateUrl: 'login.component.pug',
	directives: [FORM_DIRECTIVES, NgIf],
	providers: [HTTP_PROVIDERS]
})
export class LoginComponent {
	form: ControlGroup;
	error: boolean = false;
	@Input() loggedIn;
	@Output() onLogin = new EventEmitter<boolean>();
	id: number = pilotId();
	
	constructor(
		fb: FormBuilder,
		private auth: AuthService, 
		private router: Router
	) { 
		this.form = fb.group({
			email:	['', Validators.required],
			password:	['', Validators.required]
		});
	}
	
	onLogout() {
		this.auth.logout().subscribe((result) => {
			if (result) {
				this.router.navigate(['Events']);
				console.log(isLoggedin());
				console.log(pilotId());
				this.loggedIn = isLoggedin();
				this.onLogin.emit(this.loggedIn);
			}
		} , () => { this.error = true; } );
	}

	onSubmit(email, password):void {
		this.auth.login(email, password).subscribe((result) => {
			if (result) {
				this.router.navigate(['Events']);
				console.log(isLoggedin());
				this.loggedIn = isLoggedin();
				this.id = pilotId();
				this.onLogin.emit(this.loggedIn);
			}
		} , () => { this.error = true; } );
	}
}