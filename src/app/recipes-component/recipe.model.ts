import { Ingredient } from '../shared/ingredient.model';

export class Recipe {
  public name: string;
  public description: string;
  public imagePath: string;
  public ingredients: Ingredient[];
  public uom: string;
  public instructions: string;

  constructor(
    name: string,
    desc: string,
    imagePath: string,
    ingredients: Ingredient[],
    instructions: string
  ) {
    this.name = name;
    this.description = desc;
    this.imagePath = imagePath;
    this.ingredients = ingredients;
    this.instructions = instructions;
  }
}
