import { ConfigDictionary } from './config-dictionary';

export class Challenge {
  challengeId: number;
  title: string;
  description: string;
  appName: string;
  order: number;
  timeBox: number;
  hints: string[] = [];
  answers: string[] = [];
  config: ConfigDictionary = { };
  completed: boolean;
}
