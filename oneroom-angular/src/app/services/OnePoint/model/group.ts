import { User } from './user';

export class Group {
  groupId: string;
  name: string;
  creationDate: Date;
  users: User[];
}
