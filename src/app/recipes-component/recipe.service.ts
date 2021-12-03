import { EventEmitter, Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shoppinglist-component/shoppinglist.service';
import { Recipe } from './recipe.model';

@Injectable()
export class RecipeServices {
  recipeSelected = new EventEmitter<Recipe>();

  private recipes: Recipe[] = [
    new Recipe(
      'Chicken Pasta',
      'A delicious, heart-warming meal for the whole family.',
      'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/slow-cooker-spanish-chicken-4b787a1.jpg?quality=90&webp=true&resize=375,341',
      [new Ingredient('Chicken', 1), new Ingredient('Pasta', 2)]
    ),
    new Recipe(
      'Avocado bean Soup',
      'This cool, refreshing meal is a fan favorite amongst foodies looking for a nutrient dense meal.',
      'https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fimages.media-allrecipes.com%2Fuserphotos%2F7273647.jpg&w=596&h=596&c=sc&poi=face&q=85',
      [
        new Ingredient('Avocado', 1),
        new Ingredient('Beans', 2),
        new Ingredient('Soup', 1),
      ]
    ),
  ];

  constructor(private slService: ShoppingListService) {}

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.slService.addIngredients(ingredients);
  }
}
