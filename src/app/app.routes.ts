import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';

import { UploadComponent } from './components/upload/upload.component';
import { CrawlComponent } from './components/crawl/crawl.component';
import { KbManagerComponent } from './components/kb-manager/kb-manager.component';
import { OrganizationsComponent } from './components/organizations/organizations.component';
import { HomeComponent } from './components/home/home.component';
import { BotsComponent } from './components/bots/bots.component';
import { superadminGuard, authGuard } from './guards/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { AuthService } from './services/auth.service'; 
import { ShellComponent } from './layouts/shell/shell.component';

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent, // ✅ must be the root shell
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'bots', component: BotsComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'settings', loadComponent: () => import('./components/settings/settings.component').then(m => m.SettingsComponent)}
    ]
  },
  { path: 'login', component: LoginComponent }
];
