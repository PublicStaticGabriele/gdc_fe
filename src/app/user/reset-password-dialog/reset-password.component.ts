import { Component, Inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogTitle
} from '@angular/material/dialog';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-reset-password-dialog',
  templateUrl: './reset-password.component.html',
  imports: [
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    TranslatePipe
  ],
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ResetPasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { email: string }
  ) {}

  onCancel() {
    this.dialogRef.close();
  }

  onConfirm() {
    this.dialogRef.close(this.data.email);
  }
}
