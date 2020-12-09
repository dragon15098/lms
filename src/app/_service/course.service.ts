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

  public insertOrUpdateCourse(course: Course): Observable<Course> {
    return this.httpService.post<Course>(`${environment.apiUrl}/course`, course);
  }

  public getCourseDetail(id: number): Observable<Course> {
    return this.httpService.get<Course>(`${environment.apiUrl}/course/${id}`);
  }
}
