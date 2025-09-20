import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RecipeServices } from '../recipes-component/recipe.service';
import { Recipe } from '../recipes-component/recipe.model';
import { IndexedDBService } from './indexeddb.service';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class dataStorageService {
  constructor(
    private recipeService: RecipeServices,
    private indexedDBService: IndexedDBService
  ) {}

  /**
   * Store recipes to IndexedDB
   * Note: Individual recipes are automatically stored when added/updated through RecipeService
   * This method is kept for compatibility but doesn't need to do anything
   */
  storeRecipes(): Observable<boolean> {
    // Recipes are automatically stored in IndexedDB through the RecipeService
    // This method is kept for backward compatibility
    return new Observable(observer => {
      observer.next(true);
      observer.complete();
    });
  }

  /**
   * Fetch recipes from IndexedDB
   */
  fetchRecipes(): Observable<Recipe[]> {
    return this.indexedDBService.getAllRecipes().pipe(
      tap((recipes) => {
        // Ensure ingredients array exists and convert to Recipe instances
        const processedRecipes = recipes.map((recipe) => new Recipe(
          recipe.name,
          recipe.description,
          recipe.imagePath,
          recipe.ingredients ? recipe.ingredients : [],
          recipe.instructions,
          recipe.id,
          recipe.steps
        ));
        this.recipeService.setRecipes(processedRecipes);
      })
    );
  }

  /**
   * Clear all recipes from IndexedDB
   */
  clearAllRecipes(): Observable<boolean> {
    return this.indexedDBService.clearAllRecipes().pipe(
      tap(() => {
        this.recipeService.setRecipes([]);
      })
    );
  }

  /**
   * Search recipes in IndexedDB
   */
  searchRecipes(searchTerm: string): Observable<Recipe[]> {
    return this.indexedDBService.searchRecipes(searchTerm);
  }
}
