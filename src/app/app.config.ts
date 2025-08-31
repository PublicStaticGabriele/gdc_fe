import {
  ApplicationConfig, importProvidersFrom,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  provideHttpClient,
  withFetch,
  withInterceptorsFromDi
} from '@angular/common/http';
import {HttpApiUrlInterceptor} from './core/http.api.interceptor';
import {provideTranslateHttpLoader} from '@ngx-translate/http-loader';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpLoaderFactory} from './core/translation.core';
import {adapterFactory} from 'angular-calendar/date-adapters/moment';
import {CalendarModule, DateAdapter} from 'angular-calendar';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: DateAdapter,
      useFactory: adapterFactory
    },
    provideHttpClient(
      withInterceptorsFromDi(),
      withFetch()
    ),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideTranslateHttpLoader(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpApiUrlInterceptor,
      multi: true
    },
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      })
    ),
  ],
};
