import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment.prod';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Section} from '../_model/section';
import {Course} from '../_model/course';
import {Lesson} from '../_model/lesson';

@Injectable({providedIn: 'root'})
export class LessonService {
  constructor(private httpService: HttpClient) {
  }

  public getDetail(lessonId: number): Observable<Lesson> {
    return this.httpService.get<Lesson>(`${environment.apiUrl}/lesson/${lessonId}`);
  }

  public insertOrUpdate(lesson: Lesson): Observable<Lesson> {
    return this.httpService.post<Lesson>(`${environment.apiUrl}/lesson`, lesson);
  }
}
