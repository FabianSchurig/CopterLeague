import { bootstrap } from '@angular/platform-browser-dynamic';
import { ROUTER_PROVIDERS, LocationStrategy, HashLocationStrategy } from '@angular/router-deprecated';
import { HTTP_PROVIDERS }    from '@angular/http';
import { provide } from '@angular/core';

import { PilotService } from './pilot.service';
import { EventService } from './event.service';
import { AppComponent } from './app.component';
import { AuthService } from './auth.service';

bootstrap(AppComponent, [
  ROUTER_PROVIDERS,
  provide(LocationStrategy, {useClass: HashLocationStrategy}),
  HTTP_PROVIDERS,
  PilotService,
  EventService,
  AuthService
]);
