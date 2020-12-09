import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment.prod';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from '../_model/user';

@Injectable({providedIn: 'root'})
export class UseService {
  constructor(private httpService: HttpClient) {
  }

  public getAllInstructor(): Observable<User[]> {
    return this.httpService.get<User[]>(`${environment.apiUrl}/user/instructor`);
  }

  public getAllUser(): Observable<User[]> {
    return this.httpService.get<User[]>(`${environment.apiUrl}/user/getAll`);
  }

  public insertOrUpdate(user: User): Observable<User> {
    return this.httpService.post<User>(`${environment.apiUrl}/user/`, user);
  }

  public getUserDetail(userId: number): Observable<User> {
    return this.httpService.get<User>(`${environment.apiUrl}/user/${userId}`);
  }
}
