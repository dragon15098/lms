import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment.prod';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class QuizQuestionService {
  constructor(private httpService: HttpClient) {
  }

  public deleteQuizQuestion(questionId: number): Observable<any> {
    return this.httpService.delete<any>(`${environment.apiUrl}/quiz_question/${questionId}`);
  }

}
