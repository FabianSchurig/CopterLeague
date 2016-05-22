import { Injectable }     from '@angular/core';
import { Http, Response, RequestOptions } from '@angular/http';

import { Event }          from './event';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class EventService {
	constructor (private http: Http) {}

	private eventsUrl = 'api/event';  // URL to web API

	addEvent(data: Object): Observable<Event> {
		let body = 'title=' + data.title + '&date=' + data.date;
		//let body = JSON.stringify({data});
		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });

		return this.http.post(this.eventsUrl, body, options)
						.map(this.extractData)
						.catch(this.handleError);
	}
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
