export class Ingredient {
  public id?: string;

  constructor(
    public name: string,
    public amount: number,
    public uom: string,
    id?: string
  ) {
    this.id = id;
  }
}
