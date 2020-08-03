import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class LoginGuard implements CanActivate {
  constructor(private router: Router) { }

  canActivate(): boolean {

    const user = localStorage.getItem('user');

    if (user) {
      this.router.navigate(['/home']);
      return false;
    }

    return true;
  }
}
