import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment.prod';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Category} from '../_model/category';

@Injectable({providedIn: 'root'})
export class CategoryService {
  constructor(private httpService: HttpClient) {
  }

  public getAll(): Observable<Category[]> {
    return this.httpService.get<Category[]>(`${environment.apiUrl}/category/get_all`);
  }

  public createOrUpdate(category: Category): Observable<Category[]> {
    return this.httpService.post<Category[]>(`${environment.apiUrl}/category`, category);
  }
}
