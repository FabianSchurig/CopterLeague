import { Component } from '@angular/core';
import { Router } from '@angular/router-deprecated';
import { HTTP_PROVIDERS }    from '@angular/http';
import { FORM_DIRECTIVES, FormBuilder, Validators, ControlGroup, NgIf } from '@angular/common';

import { AuthService } from './auth.service';
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

	onSubmit(email, password):void {
		this.auth.login(email, password).subscribe((result) => {
			if (result) {
				this.router.navigate(['Events']);
			}
		} , () => { this.error = true; } );
	}
}