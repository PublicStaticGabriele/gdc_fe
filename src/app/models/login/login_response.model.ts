import {DivingCenter} from '../diving_center.model';

export interface LoginResponse {
  token: string;
  username: string;
  role: string;
  userId: number;
  dashboardImageUrl: string;
  divingCenters: DivingCenter[];
}
