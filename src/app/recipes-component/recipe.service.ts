import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shoppinglist-component/shoppinglist.service';
import { Recipe } from './recipe.model';
import { IndexedDBService, RecipeWithId } from '../shared/indexeddb.service';

@Injectable()
export class RecipeServices {
  recipesChanged = new Subject<Recipe[]>();

  private recipes: Recipe[] = [];

  constructor(
    private slService: ShoppingListService,
    private indexedDBService: IndexedDBService
  ) {
    // Load recipes from IndexedDB on service initialization
    this.loadRecipesFromDB();
  }

  /**
   * Load recipes from IndexedDB
   */
  private loadRecipesFromDB(): void {
    this.indexedDBService.getAllRecipes().subscribe({
      next: (recipes) => {
        this.recipes = recipes;
        this.recipesChanged.next(this.recipes.slice());
      },
      error: (error) => {
        console.error('Failed to load recipes from IndexedDB:', error);
        this.recipes = [];
        this.recipesChanged.next(this.recipes.slice());
      }
    });
  }

  /**
   * Set recipes (used by data storage service)
   */
  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }

  /**
   * Get all recipes
   */
  getRecipes() {
    return this.recipes.slice();
  }

  /**
   * Get recipe by index (for backward compatibility)
   */
  getRecipe(index: number) {
    return this.recipes[index];
  }

  /**
   * Get recipe by ID
   */
  getRecipeById(id: string): Recipe | undefined {
    return this.recipes.find(recipe => recipe.id === id);
  }

  /**
   * Add ingredients to shopping list
   */
  addIngredientsToShoppingList(ingredients: Ingredient[]): Observable<Ingredient[]> {
    return this.slService.addIngredients(ingredients);
  }

  /**
   * Add a new recipe
   */
  addRecipe(recipe: Recipe): Observable<Recipe> {
    return this.indexedDBService.addRecipe(recipe).pipe(
      tap((savedRecipe) => {
        this.recipes.push(savedRecipe);
        this.recipesChanged.next(this.recipes.slice());
      })
    );
  }

  /**
   * Update recipe by index (for backward compatibility)
   */
  updateRecipe(index: number, newRecipe: Recipe): Observable<Recipe> {
    const existingRecipe = this.recipes[index];
    if (existingRecipe && existingRecipe.id) {
      newRecipe.id = existingRecipe.id;
      return this.updateRecipeById(existingRecipe.id, newRecipe);
    } else {
      // If no ID exists, treat as new recipe
      return this.addRecipe(newRecipe);
    }
  }

  /**
   * Update recipe by ID
   */
  updateRecipeById(id: string, newRecipe: Recipe): Observable<Recipe> {
    newRecipe.id = id;
    return this.indexedDBService.updateRecipe(newRecipe).pipe(
      tap((updatedRecipe) => {
        const index = this.recipes.findIndex(recipe => recipe.id === id);
        if (index !== -1) {
          this.recipes[index] = updatedRecipe;
          this.recipesChanged.next(this.recipes.slice());
        }
      })
    );
  }

  /**
   * Delete recipe by index (for backward compatibility)
   */
  deleteRecipe(index: number): Observable<boolean> {
    const recipe = this.recipes[index];
    if (recipe && recipe.id) {
      return this.deleteRecipeById(recipe.id);
    } else {
      // If no ID, just remove from local array
      this.recipes.splice(index, 1);
      this.recipesChanged.next(this.recipes.slice());
      return new Observable(observer => {
        observer.next(true);
        observer.complete();
      });
    }
  }

  /**
   * Delete recipe by ID
   */
  deleteRecipeById(id: string): Observable<boolean> {
    return this.indexedDBService.deleteRecipe(id).pipe(
      tap(() => {
        const index = this.recipes.findIndex(recipe => recipe.id === id);
        if (index !== -1) {
          this.recipes.splice(index, 1);
          this.recipesChanged.next(this.recipes.slice());
        }
      })
    );
  }

  /**
   * Refresh recipes from IndexedDB
   */
  refreshRecipes(): void {
    this.loadRecipesFromDB();
  }
}
