import { bootstrap } from '@angular/platform-browser-dynamic';
import { ROUTER_PROVIDERS } from '@angular/router-deprecated';
import { HTTP_PROVIDERS }    from '@angular/http';

import { PilotService } from './pilot.service';
import { EventService } from './event.service';
import { AppComponent } from './app.component';

bootstrap(AppComponent, [
  ROUTER_PROVIDERS,
  HTTP_PROVIDERS,
  PilotService,
  EventService
]);
