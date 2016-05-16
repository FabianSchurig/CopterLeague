import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';

import { Event }          from './event';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class EventService {
	constructor (private http: Http) {}

	private eventsUrl = 'api/event';  // URL to web API

	getEvents (): Observable<Event[]> {
		console.log('getEvents');
		return this.http.get(this.eventsUrl)
					.map(this.extractData)
					.catch(this.handleError);
	}
	getEvent(id: number) {
		return this.http.get(this.eventsUrl + '/'+id)
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
