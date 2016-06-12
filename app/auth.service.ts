import { Injectable }	  from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';

import { Observable }     from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class AuthService {
	token: String;

	constructor(
		private http : Http
	) {
		this.token = localStorage.getItem('token');
	}

	login(email: String, password: String) {
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		return this.http.post('/api/auth/login', JSON.stringify({
				email: email, password: password
			}), { headers })
			.map(this.extractData)
			.catch(this.handleError);
	}

	logout() {
		return this.http.get('/api/auth/logout', {
			headers: new Headers({'x-security-token': this.token})
		}).map((res : any) => {
			this.token = undefined;
			localStorage.removeItem('token');
		});
	}
	private extractData(res: Response) {
		if (res.status < 200 || res.status >= 300) {
			throw new Error('Response status: ' + res.status);
		}
		let body = res.json();
		this.token = body.token;
		localStorage.setItem('token', this.token);
		console.log(body);
		return body || [];
	}
	private handleError (error: any) {
		// In a real world app, we might use a remote logging infrastructure
		let errMsg = error.message || 'Server error';
		console.error(errMsg); // log to console instead
		return Observable.throw(errMsg);
	}
}