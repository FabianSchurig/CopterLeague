import {Injectable} from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';

import { Observable }     from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class AuthService {
	token: String;

	constructor() {
		this.token = localStorage.getItem('token');
	}

	login(email: String, password: String) {

		return this.http.post('/api/auth/login', JSON.stringify({
				email: email,
				password: password
			}), {headers: new Headers({'Content-Type': 'application/json'})
			}).map((res : any) => {
				let data = res.json();
				this.token = data.token;
				localStorage.setItem('token', this.token);
			});
	}

	logout() {
		return this.http.get(this.config.serverUrl + '/api/auth/logout', {
			headers: new Headers({'x-security-token': this.token})
		}).map((res : any) => {
			this.token = undefined;
			localStorage.removeItem('token');
		});
	}
}