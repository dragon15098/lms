import {InstructorDetail} from './instructor-detail';
import {StudentDetail} from './student-detail';
import {Role} from './role';

export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  instructorDetail: InstructorDetail;
  studentDetail: StudentDetail;
  name: string;
  accessToken?: string;
  imageUrl: string;
  roles: Role[];
}
