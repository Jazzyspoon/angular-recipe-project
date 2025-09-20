import { Ingredient } from '../shared/ingredient.model';

export interface RecipeStep {
  stepNumber: number;
  instruction: string;
  estimatedTime?: string; // e.g., "5 minutes", "1 hour"
  temperature?: string;   // e.g., "350°F", "Medium heat"
}

export class Recipe {
  public id?: string;
  public name: string;
  public description: string;
  public imagePath: string;
  public ingredients: Ingredient[];
  public uom: string;
  public instructions: string; // Keep for backward compatibility
  public steps?: RecipeStep[]; // New structured steps

  constructor(
    name: string,
    desc: string,
    imagePath: string,
    ingredients: Ingredient[],
    instructions: string,
    id?: string,
    steps?: RecipeStep[]
  ) {
    this.id = id;
    this.name = name;
    this.description = desc;
    this.imagePath = imagePath;
    this.ingredients = ingredients;
    this.instructions = instructions;
    this.steps = steps;
  }

  // Helper method to get steps from instructions if steps array is not available
  getStepsArray(): RecipeStep[] {
    if (this.steps && this.steps.length > 0) {
      return this.steps;
    }

    // Convert instructions string to steps array
    if (this.instructions) {
      const instructionLines = this.instructions
        .split(/\n|\.(?=\s[A-Z])|(?:\d+\.?\s)/) // Split on newlines, periods followed by capital letters, or numbered steps
        .filter(line => line.trim().length > 0)
        .map(line => line.trim());

      return instructionLines.map((instruction, index) => ({
        stepNumber: index + 1,
        instruction: instruction.replace(/^\d+\.?\s*/, '') // Remove leading numbers
      }));
    }

    return [];
  }
}
