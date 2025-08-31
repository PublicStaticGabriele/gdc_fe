import { Component } from '@angular/core';
import { UserProfileService } from '../user-profile.service';
import { ActivatedRoute, Router } from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { passwordMatchValidator } from '../../validators/user-validators';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {ApiResponse} from '../../models/api/api.interface';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
  imports: [
    ReactiveFormsModule,
    TranslatePipe
  ],
  standalone: true
})
export class ResetPasswordComponent {

  readonly form: FormGroup;
  errorMsg = '';
  isSuccess = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly service: UserProfileService,
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly translate: TranslateService
  ) {
    this.form = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: passwordMatchValidator });
  }

  submit(): void {
    if (this.form.invalid) return;
    const token = this.route.snapshot.paramMap.get('token');
    if (!token) {
      this.errorMsg = this.translate.instant('resetPassword.error.tokenNotFound');
      return;
    }
    this.service.resetPasswordByToken({token, newPassword: this.form.value.newPassword!}).subscribe({
      next: () => {
        this.isSuccess = true;
        this.errorMsg = this.translate.instant('common.redirect.login');
        setTimeout(() => {
          localStorage.setItem('logout-requested', '1');
          this.router.navigate(['/login'], { queryParams: { reset: 'ok' } })
        }, 2000);
      },
      error: (err: ApiResponse<void>) => {
        this.errorMsg = err.message || this.translate.instant('common.error.generic');
      }
    });
  }
}
