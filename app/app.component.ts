import { Component } from '@angular/core';
import { RouteConfig, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { FORM_DIRECTIVES, FormBuilder, Validators, ControlGroup, NgIf } from '@angular/common';
import { HTTP_PROVIDERS }    from '@angular/http';

import { PilotsComponent } from './pilots.component';
import { PilotDetailComponent } from './pilot-detail.component';
import { PilotService } from './pilot.service';
import { EventsComponent } from './events.component';
import { EventDetailComponent } from './event-detail.component';
import { EventService } from './event.service';
import { AuthService } from './auth.service';
import { isLoggedin }	from './is-loggedin';
import 'rxjs/Rx';

@Component({
	selector: 'my-app',
	templateUrl: 'app.component.pug',
	directives: [ROUTER_DIRECTIVES, PilotsComponent, EventsComponent, FORM_DIRECTIVES, NgIf],
	providers: [PilotService, EventsComponent]
})
@RouteConfig([
	// {path: '/', redirectTo: ['Dashboard'] },
	{path: '/pilots', name: 'Pilots', component: PilotsComponent},
	{path: '/events', name: 'Events', component: EventsComponent, useAsDefault: true},
	{path: '/event/detail/:id', name: 'EventDetail', component: EventDetailComponent},
	{path: '/pilot/detail/:id', name: 'PilotDetail', component: PilotDetailComponent}
])
export class AppComponent {
	form: ControlGroup;
	error: boolean = false;
	constructor(fb: FormBuilder, public auth: AuthService, public router: Router) {
		this.form = fb.group({
			email:	['', Validators.required],
			password:	['', Validators.required]
		});
	}

	onSubmit(value: any) {
		this.auth.login(value.email, value.password)
			.subscribe(
				(token: any) => { this.router.navigate(['../Events']); },
				() => { this.error = true; }
			);
	}

}