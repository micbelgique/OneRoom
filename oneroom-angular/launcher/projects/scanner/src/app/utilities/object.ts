export class Objects {
  label: string;
  description: string;
  hint: string;
  image = null;

  constructor(label, description, hint) {
    this.label = label;
    this.description = description;
    this.hint = hint;
  }
}
