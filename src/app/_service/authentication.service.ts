import {map} from 'rxjs/operators';
import {BehaviorSubject, Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment.prod';
import {Token} from '../_model/token';

@Injectable({providedIn: 'root'})
export class AuthenticationService {
  currentUserSubject: BehaviorSubject<Token>;
  public currentUser: Observable<Token>;

  constructor(private http: HttpClient) {
    const tokenS = localStorage.getItem('currentUser');
    if (tokenS !== null && tokenS !== '') {
      this.currentUserSubject = new BehaviorSubject<Token>(JSON.parse(tokenS));
      this.currentUser = this.currentUserSubject.asObservable();
    }
  }

  public get currentUserValue(): Token {
    if (this.currentUserSubject === undefined) {
      return null;
    }
    return this.currentUserSubject.value;
  }

  login(username: string, password: string): any {
    return this.http.post<any>(`${environment.apiUrl}/login`, {username, password})
      .pipe(map(token => {
        // store token details and jwt token in local storage to keep token logged in between page refreshes
        localStorage.setItem('currentUser', JSON.stringify(token));
        this.currentUserSubject.next(token);
        this.currentUserSubject = new BehaviorSubject<Token>(token);
        this.currentUser = this.currentUserSubject.asObservable();
        return token;
      }));
  }

  logout(): void {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  clear(): void {
    if (this.currentUserSubject !== undefined) {
      this.currentUserSubject.next(null);
    }
  }
}
