import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment.prod';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class LessonQuestionService {
  constructor(private httpService: HttpClient) {
  }

  public deleteLessonQuestion(questionId: number): Observable<any> {
    return this.httpService.delete<any>(`${environment.apiUrl}/lesson_question/${questionId}`);
  }

}
