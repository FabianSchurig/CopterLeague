import { Component } from '@angular/core';
import { RouteConfig, ROUTER_DIRECTIVES } from '@angular/router-deprecated';

import { PilotsComponent } from './pilots.component';
import { PilotService } from './pilot.service';
import { EventsComponent } from './events.component';
import { EventDetailComponent } from './event-detail.component';
import { EventService } from './event.service';

@Component({
  selector: 'my-app',
  templateUrl: 'app.component.pug',
  directives: [ROUTER_DIRECTIVES, PilotsComponent, EventsComponent],
  providers: [PilotService, EventsComponent]
})
@RouteConfig([
  // {path: '/', redirectTo: ['Dashboard'] },
  {path: '/pilots', name: 'Pilots', component: PilotsComponent},
  {path: '/events', name: 'Events', component: EventsComponent, useAsDefault: true},
  {path: '/event/detail/:id', name: 'EventDetail', component: EventDetailComponent}
])
export class AppComponent { }