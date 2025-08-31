import {ChangeDetectorRef, Component, signal} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {Router, RouterOutlet} from '@angular/router';
import {DashboardTab, TabService} from './tab.service';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {AuthService} from '../auth/auth.service';
import {UserPanelComponent} from '../user/user-panel';
import {environment} from '../../environments/environments';
import {UserProfileService} from '../user/user-profile.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    TranslatePipe,
    CommonModule,
    ReactiveFormsModule,
    RouterOutlet,
    MatCardContent,
    MatCard,
    MatTabGroup,
    MatTab,
    UserPanelComponent,
  ],
  templateUrl: './dashboard.ng.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent{

  readonly tabs = signal<DashboardTab[]>([]);
  role = signal<string>('guest');
  userName: string | null = null;
  userDashboardImageUrl: string | null = null;
  dashboardFallbackValue = `url(${environment.fileUrl}/staff/dashboard/default.jpg)`;

  constructor(
    private tabService: TabService,
    private authService: AuthService,
    private router: Router,
    private userProfileService: UserProfileService,
    private cd: ChangeDetectorRef
  ) {
    const userRole = this.authService.getRole();
    this.role.set(userRole ? userRole : 'guest');
    this.tabs.set(this.tabService.getTabsForRole(this.role()));
  }

  ngAfterViewInit() {
    this.userProfileService.dashboardChanges$.subscribe(path => {
      if (path) {
        this.userDashboardImageUrl = `url(${environment.fileUrl}${path})`;
        this.cd.detectChanges();
      }
    });
  }

  onTabChange(index: number) {
    const selectedTab = this.tabs()[index];
    if (selectedTab) {
      this.router.navigate(['dashboard', selectedTab.route]);
    }
  }

}
