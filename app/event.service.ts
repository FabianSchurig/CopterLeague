import { Injectable }     from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';

import { Event }          from './event';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class EventService {
	constructor (private http: Http) {}

	private eventsUrl = 'api/event';  // URL to web API

	getEvents () {
		console.log('getEvents');
		return this.http.get(this.eventsUrl)
					.map(this.extractData)
					.catch(this.handleError);
	}
	
	getEventsByOffset (offset:number) {
		console.log('getEvents');
		return this.http.get(this.eventsUrl+'?offset='+offset)
					.map(this.extractData)
					.catch(this.handleError);
	}
	
	getEvent(id: number) {
		return this.http.get(this.eventsUrl + '/'+id)
					.map(this.extractData)
					.catch(this.handleError);
	}	
	
	save(event: Event){
		if(event.id){
			return this.put(event);
		}
		return this.post(event);
	}
	
	private post(event: Event){
		let data = event.data;
		let body = '';
		// parse JSON data to x-www-form-urlencoded
		for (let key in data) {
			body += encodeURIComponent(key)+'='+encodeURIComponent(data[key])+'&';
		}
		let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
		let options = new RequestOptions({ headers: headers });

		return this.http.post(this.eventsUrl, body, options)
						.map(this.extractData)
						.catch(this.handleError);
	}
	
	private put(event: Event){
		let data = event.data;
		let body = '';
		// parse JSON data to x-www-form-urlencoded
		for (let key in data) {
			body += encodeURIComponent(key)+'='+encodeURIComponent(data[key])+'&';
		}
		let url = `${this.eventsUrl}/${this.event.data.id}`;
		let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
		let options = new RequestOptions({ headers: headers });

		return this.http.put(url, body, options)
						.map(this.extractData)
						.catch(this.handleError);
	}
	
	private extractData(res: Response) {
		if (res.status < 200 || res.status >= 300) {
			throw new Error('Response status: ' + res.status);
		}
		let body = res.json();
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
