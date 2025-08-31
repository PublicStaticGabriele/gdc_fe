import { Component, signal } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {AuthService} from './auth/auth.service';
import {Router, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {

  protected readonly title = signal('gdc_fe');
  private readonly applicationLanguages = ['en', 'it','in','fr'];
  private readonly defaultFallBackLanguage = 'en';

  constructor(translate: TranslateService, private router: Router, private authService: AuthService) {
    translate.addLangs(this.applicationLanguages);
    translate.setFallbackLang(this.defaultFallBackLanguage);
    const browserLang = translate.getBrowserLang();
    const foundLang = browserLang && this.applicationLanguages.includes(browserLang)
      ? browserLang
      : this.defaultFallBackLanguage;
    //translate.use(foundLang); FIXME: reintrodurre foundLang in final
    translate.use(this.defaultFallBackLanguage);
  }

  ngOnInit() {
    window.addEventListener('storage', (event) => {
      if (event.key === 'logout-requested' && event.newValue === '1') {
        this.authService.logout();
        this.router.navigate(['/login']);
      }
    });
  }

}
