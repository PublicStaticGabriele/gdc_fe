import {Component, EventEmitter, Output, Input, OnInit, signal, AfterViewInit, ChangeDetectorRef} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { UserProfileService } from './user-profile.service';
import { UserProfileData } from '../models/user/user.model';
import {MatIconButton} from '@angular/material/button';
import {AuthService} from '../auth/auth.service';
import {DivingCenter} from '../models/diving_center.model';
import {TranslatePipe} from '@ngx-translate/core';
import {environment} from '../../environments/environments';
import {Router} from '@angular/router';
import {ResetPasswordDialogComponent} from './reset-password-dialog/reset-password.component';
import {MatDialog} from '@angular/material/dialog';
import {ChangeEmailDialogComponent} from './change-email-dialog/change-email-dialog.components';
import {ApiResponse} from '../models/api/api.interface';


@Component({
  selector: 'app-user-panel',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatIconButton, TranslatePipe, NgOptimizedImage],
  templateUrl: './user-panel.ng.html',
  styleUrl: './user-panel.scss'
})
export class UserPanelComponent implements OnInit {

  @Input() open = false;
  @Output() username = new EventEmitter<string>();

  uploadingPhoto = signal(false);
  isProfileOpen = signal(false);
  user = signal<UserProfileData | null>(null);
  expandedCenter: number | null = null;
  avatarUrl: string | undefined;
  avatarFallbackValue = environment.fileUrl + '/staff/images/default_avatar.png';

  constructor(
    private userProfileService: UserProfileService,
    protected authService: AuthService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.userProfileService.getProfile().subscribe({
      next: (apiResponse) => {
        if(apiResponse.data && apiResponse.success) {
          this.user.set(apiResponse.data);
          this.userProfileService.setAvatarChanged(apiResponse.data.avatarPhotoUrl);
          if (apiResponse.data?.username) this.username.emit(apiResponse.data.username);
          const centers = apiResponse.data?.divingCenters || [];
          const selectedId = this.authService.getSelectedDivingCenter?.();
          let expandedIndex = null;
          if (selectedId && centers.length > 0) expandedIndex = centers.findIndex(c => c.id === selectedId);
          // Se non trovato, fallback a primo centro espandibile
          this.expandedCenter = expandedIndex !== -1 ? expandedIndex : (centers.length === 1 ? 0 : null);
          // Se c'è un solo centro, aggiorna anche in AuthService
          if (centers.length === 1) this.authService.setSelectedDivingCenter(centers[0].id);
        }
      },
      error: (error: ApiResponse<any>) => {
        //TODO: pagina di errore?
      }
    });
  }

  ngAfterViewInit() {
    this.userProfileService.avatarChanges$.subscribe(path => {
      if (path) {
        this.avatarUrl = environment.fileUrl + path;
        this.cd.detectChanges();
      }
    });
  }



  togglePanel() {
    this.isProfileOpen.update(state => !state);
  }

  toggleCenter(index: number) {
    this.expandedCenter = this.expandedCenter === index ? null : index;
  }

  switchDivingCenter(center: DivingCenter) {
    // Azione per cambiare diving center (emit, chiamata a service ecc.)
  }

  onResetPassword() {
    const dialogRef = this.dialog.open(ResetPasswordDialogComponent, {
      width: '360px',
      data: { email: this.user()?.email || '' }
    });

    dialogRef.afterClosed().subscribe(email => {
      if (email) {
        this.userProfileService.requestPasswordReset().subscribe(() => {

        });
      }
    });
  }

  onChangeEmail() {
    const dialogRef = this.dialog.open(ChangeEmailDialogComponent, {
      width: '450px',
      data: { email: this.user()?.email || '' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.newEmail) {
        this.onLogout();
      }
    });
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }


  uploadAvatar(event: Event) {
    const input = event.target as HTMLInputElement;
    if(input.files && input.files.length > 1) {
      //error
    }
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.uploadingPhoto.set(true);
      this.userProfileService.uploadAvatarImage(file).subscribe();
      this.uploadingPhoto.set(false);
    }
  }

  uploadDashboardImage(event:Event){
    const input = event.target as HTMLInputElement;
    if(input.files && input.files.length > 1) {
      //error
    }
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.uploadingPhoto.set(true);
      this.userProfileService.uploadDashboardImage(file).subscribe();
      this.uploadingPhoto.set(false);
    }
  }

}
