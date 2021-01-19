import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment.prod';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Course} from '../_model/course';
import {Category} from '../_model/category';
import {Page} from '../_model/page';

@Injectable({providedIn: 'root'})
export class CourseService {
  constructor(private httpService: HttpClient) {
  }

  public searchCourse(listCategory: Category[],
                      courseName: string,
                      createFrom: string,
                      createTo: string,
                      instructor: string,
                      status: string): Observable<Page<Course>> {
    console.log(listCategory);
    if (listCategory != null) {
      if (status === undefined) {
        status = '';
      }
      const categoryId = Array.from(listCategory.map(value => value.id)).toString();
      return this.httpService.get<Page<Course>>(`${environment.apiUrl}/course/search`,
        {
          params: {
            categoryId,
            courseName,
            createFrom,
            createTo,
            instructor,
            status
          }
        });
    } else {
      return null;
    }
  }

  public insertOrUpdateCourse(course: Course): Observable<Course> {
    return this.httpService.post<Course>(`${environment.apiUrl}/course`, course);
  }

  public getCourseDetail(id: number): Observable<Course> {
    return this.httpService.get<Course>(`${environment.apiUrl}/course/${id}`);
  }

  public approve(course: Course): Observable<Course> {
    return this.httpService.post<Course>(`${environment.apiUrl}/course/approve`, course);
  }
}
