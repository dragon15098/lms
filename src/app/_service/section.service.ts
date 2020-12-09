import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment.prod';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Section} from '../_model/section';
import {Course} from '../_model/course';

@Injectable({providedIn: 'root'})
export class SectionService {
  constructor(private httpService: HttpClient) {
  }

  public getAllSectionByCourse(course: Course): Observable<Section[]> {
    return this.httpService.get<Section[]>(`${environment.apiUrl}/section/get_course_section/${course.id}`);
  }

  public getDetail(sectionId: number): Observable<Section> {
    return this.httpService.get<Section>(`${environment.apiUrl}/section/${sectionId}`);
  }

  public insertOrUpdate(section: Section): Observable<Section> {
    return this.httpService.post<Section>(`${environment.apiUrl}/section`, section);
  }
}
