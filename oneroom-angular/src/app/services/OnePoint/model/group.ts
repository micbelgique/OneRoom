import { User } from './user';

export class Group {
  id: number;
  groupId: string;
  name: string;
  creationDate: Date;
  users: User[];
}
