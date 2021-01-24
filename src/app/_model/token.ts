import {User} from './user';

export interface Token {
  tokenType: string;
  accessToken: string;
  user: User;
}
