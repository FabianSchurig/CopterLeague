import { Injectable }     from '@angular/core';
import { Http } from '@angular/http';

import { Observable }     from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class MapService {
	token: String;
	id: number;
	
	constructor (private http: Http) {
	}

	private mapUrl = 'api/map';  // URL to web API

	getMarker () {
		return this.http.get(this.mapUrl)
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
