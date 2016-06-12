import { Component } from '@angular/core';
import { RouteConfig, ROUTER_DIRECTIVES } from '@angular/router-deprecated';

import { PilotsComponent } from './pilots.component';
import { PilotDetailComponent } from './pilot-detail.component';
import { PilotService } from './pilot.service';
import { EventsComponent } from './events.component';
import { EventDetailComponent } from './event-detail.component';
import { EventService } from './event.service';

import { AuthService } from './auth.service';
import { isLoggedin }	from './is-loggedin';
import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';

@Component({
  selector: 'my-app',
  templateUrl: 'app.component.pug',
  directives: [ROUTER_DIRECTIVES, PilotsComponent, EventsComponent, LoginComponent, RegisterComponent],
  providers: [PilotService, EventsComponent]
})
@RouteConfig([
  // {path: '/', redirectTo: ['Dashboard'] },
  {path: '/register', name: 'Register', component: RegisterComponent},
  {path: '/login', name: 'Login', component: LoginComponent},
  {path: '/pilots', name: 'Pilots', component: PilotsComponent},
  {path: '/events', name: 'Events', component: EventsComponent, useAsDefault: true},
  {path: '/event/detail/:id', name: 'EventDetail', component: EventDetailComponent},
  {path: '/pilot/detail/:id', name: 'PilotDetail', component: PilotDetailComponent}
])
export class AppComponent {
	isLoggedin: boolean = false;
}