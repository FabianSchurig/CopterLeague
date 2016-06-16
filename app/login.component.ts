import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Router, RouteParams, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { HTTP_PROVIDERS }		from '@angular/http';
import { FORM_DIRECTIVES, FormBuilder, Validators, ControlGroup, NgIf } from '@angular/common';

import { AuthService } from './auth.service';
import { isLoggedin, pilotId } from './is-loggedin';
import 'rxjs/Rx';


@Component({
	selector: 'login',
	templateUrl: 'login.component.pug',
	directives: [FORM_DIRECTIVES, NgIf, ROUTER_DIRECTIVES],
	providers: [HTTP_PROVIDERS]
})
export class LoginComponent implements OnInit {
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
	
	fbLogin(response){
		this.auth.facebookLogin(response).subscribe((result) => {
			if (result) {
				console.log(isLoggedin());
				this.loggedIn = isLoggedin();
				this.id = pilotId();
				this.onLogin.emit(this.loggedIn);
			}
		} , () => { this.error = true; } );
	}
	
	ngOnInit(){
		console.log('login init')
		FB.init({
			appId		: '1708147599444937', // TODO replace with api get appId
			cookie		: true,	// enable cookies to allow the server to access 
								// the session
			xfbml		: true,	// parse social plugins on this page
			version		: 'v2.2' // use version 2.2
		});
		console.log('init');

	}

	checkLoginState() {
		var _this = this;
		FB.getLoginStatus(function(response) {
			if(response.status === 'connected'){
				_this.fbLogin(response.authResponse);
			}else {
				console.log('FBLogin');
				FB.login(function(response) {
					if (response.status === 'connected') {
						_this.fbLogin(response.authResponse);
					} else if (response.status === 'not_authorized') {
					
					} else {
					
					}
				}, {scope: 'public_profile,email'});
			}
		});
	}
	
}