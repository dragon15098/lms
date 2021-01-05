import {Category} from './category';
import {User} from './user';
import {Section} from './section';
import {CourseStatus} from './course';

export interface Page<T> {
  pageNumber: number;
  pageSize: number;
  data: T[];
}
