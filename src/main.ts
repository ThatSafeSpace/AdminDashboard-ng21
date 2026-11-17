import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { ListComponent } from './app/components/list/list.component';

bootstrapApplication(ListComponent, appConfig)
  .catch((err) => console.error(err));
