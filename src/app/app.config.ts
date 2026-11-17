import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideAppInitializer, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { routes } from './app.routes';
import { ApiService } from './services/api.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideTranslateService({
        lang: 'en',
        fallbackLang: 'en',
        loader: provideTranslateHttpLoader({
            prefix: 'i18n/',
            suffix: '.json',
        }),
    }),
    provideAppInitializer(() => {
        const translate = inject(TranslateService);
        translate.use(translate.getBrowserLang() || 'en');
    }),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    ApiService
  ]
};
