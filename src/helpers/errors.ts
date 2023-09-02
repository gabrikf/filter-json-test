export class FilterError extends Error {
  public readonly id: string;
  constructor(id: string, message: string) {
    super(message);
    this.id = id;
  }
}
