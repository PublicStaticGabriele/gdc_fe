import {ChangeDetectorRef, Component, Inject} from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogTitle
} from '@angular/material/dialog';
import {FormBuilder, Validators, ReactiveFormsModule, FormGroup} from '@angular/forms';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {UserProfileService} from '../user-profile.service';
import {ApiResponse} from '../../models/api/api.interface';

@Component({
  selector: 'app-change-email-dialog',
  templateUrl: './change-email-dialog.html',
  imports: [
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    ReactiveFormsModule,
    TranslatePipe
  ],
  styleUrls: ['./change-email-dialog.scss'],
  standalone: true
})
export class ChangeEmailDialogComponent {

  readonly requestForm: FormGroup;
  readonly codeForm: FormGroup;
  step: 'form' | 'confirm' = 'form';
  emailToConfirm = '';
  loading = false;
  errorMsg = '';

  constructor(
    public dialogRef: MatDialogRef<ChangeEmailDialogComponent>,
    private userService: UserProfileService,
    private readonly translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: { currentEmail: string },
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.requestForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
    this.codeForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  closeRef(){
    this.requestForm.reset();
    this.codeForm.reset();
    this.dialogRef.close();
  }

  onCancel() {
    this.userService.requestEmailChange({newEmail:this.requestForm.value.email, otpCode: this.codeForm.value.code, action: 'cancel'})
      .subscribe({
        next: () => {
          this.requestForm.reset();
          this.codeForm.reset();
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err: ApiResponse<any>) => {
          this.errorMsg = err.message || this.translate.instant('common.error.generic');
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    this.dialogRef.close();
  }

  sendCode() {
    if (this.requestForm.invalid) return;
    this.loading = true;
    this.errorMsg = '';
    this.userService.requestEmailChange({newEmail:this.requestForm.value.email, otpCode: this.codeForm.value.code, action: 'change'})
      .subscribe({
        next: () => {
          this.step = 'confirm';
          this.emailToConfirm = this.requestForm.value.email!;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err: ApiResponse<any>) => {
          this.errorMsg = err.message || this.translate.instant('common.error.generic');
          this.loading = false;
          this.cdr.detectChanges();
        }
      })
  }

  verifyCode() {
    if (this.codeForm.invalid) return;
    this.loading = true;
    this.errorMsg = '';
    this.userService.verifyEmailChange({newEmail:this.requestForm.value.email, otpCode: this.codeForm.value.code, action: ''})
      .subscribe({
        next: () => {
          this.errorMsg = this.translate.instant('common.redirect.login');
          this.loading = false;
          this.cdr.detectChanges();
          setTimeout(() => {
            localStorage.setItem('logout-requested', '1');
            this.dialogRef.close({ newEmail: this.emailToConfirm });
          }, 2500);
        },
        error: (err: ApiResponse<any>) => {
          this.errorMsg = err.message || this.translate.instant('common.error.generic');
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }
}
