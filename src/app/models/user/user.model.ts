import {DivingCenter} from '../diving_center.model';
import {DivingCompany} from '../diving_company.model';

export interface UserProfileData {
  username: string;
  email: string;
  phoneNumber: string;
  createdDate: string;
  role: string;
  avatarPhotoUrl: string;
  divingCompany: DivingCompany;
  divingCenters: DivingCenter[];
}
