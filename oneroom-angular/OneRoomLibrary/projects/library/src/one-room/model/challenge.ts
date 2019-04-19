import { Dictionary } from './dictionary';

export class Challenge {
  challengeId: number;
  title: string;
  description: string;
  appName: string;
  order: number;
  timeBox: number;
  hints: string[] = [];
  answers: string[] = [];
  config: Dictionary = {};
  data: Dictionary = {};
  completed: boolean;
}
