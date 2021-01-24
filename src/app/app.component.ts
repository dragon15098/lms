import {ChangeDetectorRef, Component, OnDestroy} from '@angular/core';
import {AuthenticationService} from './_service/authentication.service';
import {Router} from '@angular/router';
import {User} from './_model/user';
import {MediaMatcher} from '@angular/cdk/layout';
import {Token} from './_model/token';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
  currentUser: Token;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher
  ) {
    const token = this.authenticationService.currentUser;
    if (token !== undefined) {
      token.subscribe(x => this.currentUser = x);
    }
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this.mobileQueryListener);
  }

  mobileQuery: MediaQueryList;
  fillerNav: Array<string> = ['Course', 'Categories', 'User', 'Home', 'Logout'];
  routeNav: Array<string> = ['course', 'categories', 'user', 'home', 'logout'];
  private readonly mobileQueryListener: () => void;

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this.mobileQueryListener);
  }

  logout(): void {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}
