import { Injectable }     from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';

import { Pilot }          from './pilot';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class PilotService {
	token: String;
	id: number;
	
	constructor (private http: Http) {
	}

	private pilotsUrl = 'api/pilot';  // URL to web API

	private post(pilot: Pilot): Observable<Pilot>{
		this.token = localStorage.getItem('token');
		let body = JSON.stringify(pilot);
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');

		return this.http.post(this.pilotsUrl, body, {headers})
						.map(this.extractData)
						.catch(this.handleError);
	}
	
	private put(pilot: Pilot){
		this.token = localStorage.getItem('token');
		let body = JSON.stringify(pilot);
		let url = `${this.pilotsUrl}/` + pilot.id;
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		headers.append('Authorization', 'Bearer '+this.token);

		return this.http.put(url, body, { headers })
						.map(this.extractData)
						.catch(this.handleError);
	}
	
	updatePilot(pilot:Pilot){
		console.log('update pilot');
		return this.put(pilot);
	}
	
	register(pilot:Pilot){
		console.log('try register');
		return this.post(pilot);
	}
	
	getPilots (): Observable<Pilot[]> {
		console.log('getPilots');
		return this.http.get(this.pilotsUrl)
					.map(this.extractData)
					.catch(this.handleError);
	}
	getPilot(id: number) {
		return this.http.get(this.pilotsUrl + '/'+id)
					.map(this.extractData)
					.catch(this.handleError);
	}
	private extractData(res: Response) {
		if (res.status < 200 || res.status >= 300) {
			throw new Error('Response status: ' + res.status);
		}
		let body = res.json();
		if(body.data && body.data.token && body.data.id){
			this.token = body.data.token;
			this.id = body.data.id;
			localStorage.setItem('token', this.token);
			localStorage.setItem('id', this.id);
		}
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
