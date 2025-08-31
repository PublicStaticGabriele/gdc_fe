export interface DashboardTab {
  label: string;
  route: string;
  icon?: string;
  roles: string[];
}

import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TabService {

  private allTabs: DashboardTab[] = [
    { label: 'Booking', route: 'booking', icon: 'book_online', roles: ['admin', 'staff'] },
    { label: 'Activity', route: 'activity', icon: 'event', roles: ['staff', 'admin'] },
    { label: 'Staff', route: 'staff', icon: 'groups', roles: ['admin'] },
    { label: 'Items', route: 'items', icon: 'inventory', roles: ['staff', 'admin'] },
    { label: 'Customer', route: 'customer', icon: 'person', roles: ['staff', 'admin'] },
    { label: 'Admin', route: 'admin', icon: 'admin_panel_settings', roles: ['admin'] }
  ];

  getTabsForRole(role: string): DashboardTab[] {
    return this.allTabs.filter(tab => tab.roles.includes(role.toLowerCase()));
  }
}
