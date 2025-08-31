import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginRequest } from '../models/login/login_request.model';
import {LoginResponse} from '../models/login/login_response.model';
import { Observable, tap } from 'rxjs';
import {DivingCenter} from '../models/diving_center.model';
import {ApiResponse} from '../models/api/api.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private loginUrl = '/auth/staff/login';
  role = signal<string | null>(null);
  isAuthenticated = signal<boolean>(false);
  divingCenters = signal<DivingCenter[]>([]);
  selectedDivingCenterId = signal<number | null>(null);

  constructor(private http: HttpClient) {
    this.isAuthenticated.set(!!this.getToken());
    this.selectedDivingCenterId.set(this.getSelectedDivingCenter());
  }

  login(credentials: LoginRequest): Observable<ApiResponse<LoginResponse>> {
    return this.http.post<ApiResponse<LoginResponse>>(this.loginUrl, credentials).pipe(
      tap(response => {
        this.isAuthenticated.set(response.success);
        if (response.success) {
          localStorage.setItem('role', response.data.role);
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('divingCenters', JSON.stringify(response.data.divingCenters));
          this.divingCenters.set(response.data.divingCenters);
        }
      })
    );
  }

  logout() {
    localStorage.clear()
    this.isAuthenticated.set(false);
    this.selectedDivingCenterId.set(null);
    this.role.set(null);
    this.divingCenters.set([]);
  }

  setSelectedDivingCenter(id: number) {
    localStorage.setItem('selectedDivingCenter', String(id));
    this.selectedDivingCenterId.set(id);
  }

  getSelectedDivingCenter(): number | null {
    const val = localStorage.getItem('selectedDivingCenter');
    return val ? Number(val) : null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

}
