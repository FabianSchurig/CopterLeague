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
	private multisUrl = 'api/multi';
	
	private post(obj: Object, url: string){
		console.log('Post');
		console.log(obj);
		this.token = localStorage.getItem('token');
		let body = JSON.stringify(obj);
		console.log(body);
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		if(this.token != undefined){
			headers.append('Authorization', 'Bearer '+this.token);
		}

		return this.http.post(url, body, {headers})
						.map(this.extractData)
						.catch(this.handleError);
	}
	
	private put(obj:Object, url: string){
		this.token = localStorage.getItem('token');
		let body = JSON.stringify(obj);
		
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		headers.append('Authorization', 'Bearer '+this.token);

		return this.http.put(url, body, { headers })
						.map(this.extractData)
						.catch(this.handleError);
	}
	
	updatePilot(pilot:Pilot){
		console.log('update pilot');
		let url = `${this.pilotsUrl}/` + pilot.id;
		return this.put(pilot, url);
	}
	
	register(pilot:Pilot){
		console.log('try register');
		return this.post(pilot, this.pilotsUrl);
	}
	
	saveMulti(multi: Object){
		if(multi.id != undefined){
			let url = `${this.multisUrl}/` + multi.id;
			return this.put(multi, url);
		}else{
			let url = `${this.pilotsUrl}/` + pilot.id +`/multi`;
			return this.post(multi, url);
		}
		
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
	getMultis(id: number) {
		return this.http.get(this.multisUrl + '?pilot='+id)
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
