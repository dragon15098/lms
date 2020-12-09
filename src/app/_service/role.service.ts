import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Role} from '../_model/role';
import {environment} from '../../environments/environment.prod';

@Injectable({providedIn: 'root'})
export class RoleService {
  constructor(private httpService: HttpClient) {
  }

  public getAllRole(): Observable<Role[]> {
    return this.httpService.get<Role[]>(`${environment.apiUrl}/role`);
  }

}
