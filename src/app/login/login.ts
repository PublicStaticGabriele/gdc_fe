import { Component, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../auth/auth.service';
import { DivingCenter } from '../models/diving_center.model';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {MatIcon} from '@angular/material/icon';
import {ApiResponse} from '../models/api/api.interface';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    TranslatePipe,
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatIcon
  ],
  templateUrl: './login.ng.html',
  styleUrl: './login.scss'
})
export class LoginComponent {

  loginForm: FormGroup;
  loading = signal(false);
  error = signal<string | null>(null);
  showDivingCenterSelect = signal(false);
  divingCenters = signal<DivingCenter[]>([]);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      divingCenterId: [null as number | null]
    });
    this.loginForm.get('email')?.valueChanges.subscribe(value => {
      if (this.loginForm.get('email')?.invalid && !this.error.length) this.error.set(this.translate.instant('login.submit.credential'));
      else this.error.set(null);
    })
    //TOBEREMOVED: automatic admin login
    this.loginForm.setValue({
      email: 'gabrielecamisassa@gmail.com',
      password: 'ciaociao',
      divingCenterId: 1
    })
    this.onSubmit();
  }

  onSubmit() {
    if (this.showDivingCenterSelect()) {
      this.onDivingCenterSelect();
      return;
    }

    if (this.loginForm.get('email')?.invalid || this.loginForm.get('password')?.invalid) {
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const { email, password } = this.loginForm.getRawValue();

    this.authService.login({ email, password }).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          if (response.data.divingCenters && response.data.divingCenters.length > 1) {
            this.divingCenters.set(response.data.divingCenters);
            this.loginForm.get('divingCenterId')?.setValidators([Validators.required]);
            this.loginForm.get('divingCenterId')?.updateValueAndValidity();
            this.showDivingCenterSelect.set(true);
          } else if (response.data.divingCenters && response.data.divingCenters.length === 1) {
            this.authService.setSelectedDivingCenter(response.data.divingCenters[0].id);
            this.router.navigate(['/dashboard']);
          } else {
            this.translate.get('login.error.noDivingCenter').subscribe(msg => {
              this.error.set(msg);
            })
          }
        }
      },
      error: (error: ApiResponse<any>) => {
        this.error.set(error.message);
      }
    });
    this.loading.set(false);
  }

  onDivingCenterSelect() {
    const selectedId = this.loginForm.get('divingCenterId')?.value;
    if (selectedId) {
      this.authService.setSelectedDivingCenter(selectedId);
      this.router.navigate(['/dashboard']);
    }
  }

  trackById(index: number, item: DivingCenter): number {
    return item.id;
  }


}
