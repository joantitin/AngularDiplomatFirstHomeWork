import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';
import { UsersComponent } from './users/users.component';

const appRoutes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AngularFireAuthGuard]
  },
  {
    path: 'users', component: UsersComponent,
    canActivate: [AngularFireAuthGuard]
  }
];

export default appRoutes;
