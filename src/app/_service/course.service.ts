import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment.prod';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Course} from '../_model/course';

@Injectable({providedIn: 'root'})
export class CourseService {
  constructor(private httpService: HttpClient) {
  }

  public searchCourse(): Observable<Course[]> {
    return this.httpService.get<Course[]>(`${environment.apiUrl}/course/test`);
  }

  public createCourse(course: Course): Observable<Course> {
    return this.httpService.post<Course>(`${environment.apiUrl}/course/create`, course);
  }
  public updateCourse(course: Course): Observable<Course> {
    return this.httpService.post<Course>(`${environment.apiUrl}/course/update`, course);
  }

  public getCourseDetail(id: number): Observable<Course> {
    return this.httpService.get<Course>(`${environment.apiUrl}/course/${id}`);
  }
}
