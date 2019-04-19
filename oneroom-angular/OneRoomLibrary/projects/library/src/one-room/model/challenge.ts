
export class Challenge {
  challengeId: number;
  title: string;
  description: string;
  appName: string;
  order: number;
  timeBox: number;
  hints: string[] = [];
  answers: string[] = [];
  config: Map<string, string> = new Map();
  data: Map<string, string> = new Map();
  completed: boolean;
}
