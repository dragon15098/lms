import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthenticationService} from '../_service/authentication.service';
import {User} from '../_model/user';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authenticationService: AuthenticationService,
              private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const token = this.authenticationService.currentUserValue;
    if (token) {
      if (!this.checkRole(token.user, state)) {
        this.router.navigate(['/forbidden'],
          {queryParams: {returnUrl: state.url}}).then(() => {
        });
        return false;
      }
      return true;
    }

    // not logged in so redirect to login page with the return url

    this.router.navigate(['/login'],
      {queryParams: {returnUrl: state.url}}).then(() => {
    });
    return false;
  }

  private checkRole(user: User, state: RouterStateSnapshot): boolean {
    let canAccess = false;
    user.roles.forEach(role => {
      switch (state.url) {
        case '/user':
          if (role.id === 1) {
            canAccess = true;
          }
          break;
        case '/home':
          if (role.id === 1 || role.id === 3) {
            canAccess = true;
          }
          break;
        case '/categories':
          if (role.id === 1) {
            canAccess = true;
          }
          break;
        case '/course':
          if (role.id === 1 || role.id === 3) {
            canAccess = true;
          }
          break;
        case '/create-category':
          if (role.id === 1) {
            canAccess = true;
          }
          break;
        case '/create-course':
          if (role.id === 1 || role.id === 3) {
            canAccess = true;
          }
          break;
        case '/create-user':
          if (role.id === 1) {
            canAccess = true;
          }
          break;
        default:
          canAccess = true;
      }
    });
    return canAccess;
  }
}
