// luis

export class QueryResponse {
  query: string;
  topScoringIntent: Intent;
  intents: Intent[];
  entities: Entity[];
}

export class Entity {
  startIndex: number;
  endIndex: number;
  entity: string;
  resolution: Resolution;
  type: string;
}

export class Resolution {
  values: string[];
}

export class Intent {
  intent: string;
  score: number;
}

// translation

export class TranslationResponse {
  translations: Translation[];
}

export class Translation {
  text: string;
  to: string;
}



