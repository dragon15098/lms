import {InstructorDetail} from './instructor-detail';
import {StudentDetail} from './student-detail';

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
}
