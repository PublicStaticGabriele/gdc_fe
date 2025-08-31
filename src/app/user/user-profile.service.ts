import { Injectable } from '@angular/core';
import {UserProfileData} from '../models/user/user.model';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {ApiResponse} from '../models/api/api.interface';
import {ChangeEmailRequestDTO} from '../models/user/changeemail_request.model';

@Injectable({ providedIn: 'root' })
export class UserProfileService {

  constructor(private http: HttpClient) {}

  private avatarChanged$ = new BehaviorSubject<string | null>(null);
  private dashboardChanged$ = new BehaviorSubject<string | null>(null);

  get avatarChanges$(): Observable<string | null> {
    return this.avatarChanged$.asObservable();
  }
  setAvatarChanged(avatar: string | null) {
    this.avatarChanged$.next(avatar);
  }

  get dashboardChanges$(): Observable<string | null> {
    return this.dashboardChanged$.asObservable();
  }
  setDashboardChanged(dashboardImage: string | null) {
    this.dashboardChanged$.next(dashboardImage);
  }

  getProfile(): Observable<ApiResponse<UserProfileData>> {
    return this.http.get<ApiResponse<UserProfileData>>('/staff/profile-data')
  }

  uploadAvatarImage(file: File): Observable<ApiResponse<string>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ApiResponse<string>>(`/staff/upload-avatar`, formData)
      .pipe(tap((response) => this.setAvatarChanged(response.data)));
  }

  uploadDashboardImage(file: File): Observable<ApiResponse<string>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ApiResponse<string>>(`/staff/upload-dashboard-image`, formData)
      .pipe(tap((response) => this.setDashboardChanged(response.data)));
  }

  requestPasswordReset(): Observable<ApiResponse<string>>{
    return this.http.post<ApiResponse<string>>(`/staff/request-reset-password`, null);
  }

  resetPasswordByToken(payload: {token: string, newPassword: string}) {
    return this.http.post<ApiResponse<boolean>>('/staff/reset-password', payload);
  }

  requestEmailChange(changeEmailRequestDTO: ChangeEmailRequestDTO) {
    return this.http.post<ApiResponse<boolean>>('/staff/email-change-request', changeEmailRequestDTO);
  }

  verifyEmailChange(changeEmailRequestDTO: ChangeEmailRequestDTO) {
    return this.http.post<ApiResponse<boolean>>('/staff/email-change-verify', changeEmailRequestDTO);
  }

}
