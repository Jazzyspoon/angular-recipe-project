import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shoppinglist-component/shoppinglist.service';
import { Recipe } from './recipe.model';

@Injectable()
export class RecipeServices {
  recipesChanged = new Subject<Recipe[]>();

  private recipes: Recipe[] = [
    new Recipe(
      'Chicken Pasta',
      'A delicious, heart-warming meal for the whole family.',
      'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/slow-cooker-spanish-chicken-4b787a1.jpg?quality=90&webp=true&resize=375,341',
      [
        new Ingredient('Chicken chopped', 1, 'pound'),
        new Ingredient('Pasta', 1, 'package'),
        new Ingredient('Tomato chopped', 1, 'each'),
        new Ingredient('Onion chopped', 1, 'each'),
        new Ingredient('Garlic', 1, 'clove'),
        new Ingredient('Parsley', 1, 'oz'),
        new Ingredient('Salt', 1, 'teaspoon'),
        new Ingredient('Pepper', 0.5, 'teaspoon'),
      ],
      'In a large skillet, heat oil over medium-high heat. Add chicken and cook until no longer pink, about 5 minutes. Add pasta and cook until al dente, about 5 minutes. Add tomato, onion, garlic, parsley, salt, and pepper to the pasta and cook until pasta is cooked through, about 5 minutes. Serve pasta with chicken.'
    ),
    new Recipe(
      'Avocado bean Soup',
      'This cool, refreshing meal is a fan favorite amongst foodies looking for a nutrient dense meal.',
      'https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fimages.media-allrecipes.com%2Fuserphotos%2F7273647.jpg&w=596&h=596&c=sc&poi=face&q=85',
      [
        new Ingredient('Avocado', 1, 'each'),
        new Ingredient('Beans', 2, 'each'),
        new Ingredient('Salt', 1, 'teaspoon'),
        new Ingredient('Pepper', 1, 'teaspoon'),
        new Ingredient('Onion', 1, 'each'),
        new Ingredient('Onion Powder', 1, 'oz'),
      ],
      'In a large pot, bring water to a boil. Add beans and cook until tender, about 10 minutes. Drain beans and rinse under cold water.'
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
  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }
  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.recipesChanged.next(this.recipes.slice());
  }
  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }
}
