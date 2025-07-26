import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ContactComponent } from './pages/contacts/contacts.component';
import { DestinationsComponent } from './pages/destinations/destinations.component';
import { SingleComponent } from './pages/single/single.component';
import { MultiCarousalComponent } from './ui/multi-carousal/multi-carousal.component';
import { AccountComponent } from './pages/account/account.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { PreferencesComponent } from './pages/preferences/preferences.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'destinations', component: DestinationsComponent },
  { path: 'contacts', component: ContactComponent },
  { path: 'destinations/:id', component: SingleComponent },
  { path: 'single', component: SingleComponent },
  { path: 'account', component: AccountComponent },
  { path: 'state/:id', component: SingleComponent },
  { path: 'preferences', component: PreferencesComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'attractions/:state', component: MultiCarousalComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'destination/:slug', component: SingleComponent }

  


];
