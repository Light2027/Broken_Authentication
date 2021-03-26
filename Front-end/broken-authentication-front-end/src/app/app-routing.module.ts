import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutPageComponent } from './views/about-page/about-page.component';
import { DashboardPageComponent } from './views/dashboard-page/dashboard-page.component';
import { LoginPageComponent } from './views/login-page/login-page.component';
import { NotFoundPageComponent } from './views/not-found-page/not-found-page.component';
import { ProfilePageComponent } from './views/profile-page/profile-page.component';
import { RegisterPageComponent } from './views/register-page/register-page.component';
import { AuthNegatorGuard } from './guards/auth-negator.guard';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {path: 'login', component: LoginPageComponent, canActivate: [AuthNegatorGuard]},
  {path: 'register', component: RegisterPageComponent, canActivate: [AuthNegatorGuard]},
  {path: '', component: DashboardPageComponent, canActivate: [AuthGuard]},
  {path: 'profile', component: ProfilePageComponent, canActivate: [AuthGuard]},
  {path: 'about', component:AboutPageComponent, canActivate: [AuthGuard]},
  {path: '**', component:NotFoundPageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
