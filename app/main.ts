import { bootstrap } from '@angular/platform-browser-dynamic';
import { ROUTER_PROVIDERS } from '@angular/router-deprecated';

import { PilotService } from './pilot.service';
import { AppComponent } from './app.component';

bootstrap(AppComponent, [
  ROUTER_PROVIDERS,
  PilotService
]);