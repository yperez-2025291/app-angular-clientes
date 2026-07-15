import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { AppComponent } from './src/app.components';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),  // Para peticiones HTTP
  ]
}).catch((err: Error) => console.error(err));