import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment.prod';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Course} from '../_model/course';
import {User} from '../_model/user';

@Injectable({providedIn: 'root'})
export class UseService {
  constructor(private httpService: HttpClient) {
  }

  public getAllInstructor(): Observable<User[]> {
    return this.httpService.get<User[]>(`${environment.apiUrl}/user/instructor`);
  }
}
