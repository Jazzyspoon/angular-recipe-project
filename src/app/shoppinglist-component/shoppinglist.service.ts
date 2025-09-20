import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Ingredient } from '../shared/ingredient.model';
import { IndexedDBService, IngredientWithId } from '../shared/indexeddb.service';

@Injectable()
export class ShoppingListService {
  ingredientsChanged = new Subject<Ingredient[]>();
  startedEditing = new Subject<number>();
  private ingredients: Ingredient[] = [];

  constructor(private indexedDBService: IndexedDBService) {
    // Load ingredients from IndexedDB on service initialization
    this.loadIngredientsFromDB();
  }

  /**
   * Load ingredients from IndexedDB
   */
  private loadIngredientsFromDB(): void {
    this.indexedDBService.getAllShoppingListIngredients().subscribe({
      next: (ingredients) => {
        if (ingredients.length === 0) {
          // If no ingredients in DB, add some default ones
          this.initializeDefaultIngredients();
        } else {
          this.ingredients = ingredients;
          this.ingredientsChanged.next(this.ingredients.slice());
        }
      },
      error: (error) => {
        console.error('Failed to load ingredients from IndexedDB:', error);
        this.initializeDefaultIngredients();
      }
    });
  }

  /**
   * Initialize with default ingredients (first time use)
   */
  private initializeDefaultIngredients(): void {
    const defaultIngredients = [
      new Ingredient('Apples', 5, 'each'),
      new Ingredient('Tomatoes', 10, 'each'),
      new Ingredient('Flour', 1, 'cup'),
      new Ingredient('Sugar', 1, 'cup'),
      new Ingredient('Salt', 1, 'teaspoon'),
      new Ingredient('Pepper', 1, 'teaspoon'),
    ];

    // Add each default ingredient to IndexedDB
    let completed = 0;
    defaultIngredients.forEach(ingredient => {
      this.indexedDBService.addShoppingListIngredient(ingredient).subscribe({
        next: (savedIngredient) => {
          this.ingredients.push(savedIngredient);
          completed++;
          if (completed === defaultIngredients.length) {
            this.ingredientsChanged.next(this.ingredients.slice());
          }
        },
        error: (error) => {
          console.error('Failed to add default ingredient:', error);
        }
      });
    });
  }

  /**
   * Get all ingredients
   */
  getIngredients() {
    return this.ingredients.slice();
  }

  /**
   * Add a single ingredient
   */
  addIngredient(ingredient: Ingredient): Observable<Ingredient> {
    return this.indexedDBService.addShoppingListIngredient(ingredient).pipe(
      tap((savedIngredient) => {
        this.ingredients.push(savedIngredient);
        this.ingredientsChanged.next(this.ingredients.slice());
      })
    );
  }

  /**
   * Add multiple ingredients (from recipes)
   */
  addIngredients(ingredients: Ingredient[]): Observable<Ingredient[]> {
    return this.indexedDBService.addMultipleShoppingListIngredients(ingredients).pipe(
      tap((savedIngredients) => {
        this.ingredients.push(...savedIngredients);
        this.ingredientsChanged.next(this.ingredients.slice());
      })
    );
  }

  /**
   * Get ingredient by index (for backward compatibility)
   */
  getIngredient(index: number) {
    return this.ingredients[index];
  }

  /**
   * Get ingredient by ID
   */
  getIngredientById(id: string): Ingredient | undefined {
    return this.ingredients.find(ingredient => ingredient.id === id);
  }

  /**
   * Update ingredient by index (for backward compatibility)
   */
  updateIngredient(index: number, newIngredient: Ingredient): Observable<Ingredient> {
    const existingIngredient = this.ingredients[index];
    if (existingIngredient && existingIngredient.id) {
      newIngredient.id = existingIngredient.id;
      return this.updateIngredientById(existingIngredient.id, newIngredient);
    } else {
      // If no ID exists, treat as new ingredient
      return this.addIngredient(newIngredient);
    }
  }

  /**
   * Update ingredient by ID
   */
  updateIngredientById(id: string, newIngredient: Ingredient): Observable<Ingredient> {
    newIngredient.id = id;
    return this.indexedDBService.updateShoppingListIngredient(newIngredient).pipe(
      tap((updatedIngredient) => {
        const index = this.ingredients.findIndex(ingredient => ingredient.id === id);
        if (index !== -1) {
          this.ingredients[index] = updatedIngredient;
          this.ingredientsChanged.next(this.ingredients.slice());
        }
      })
    );
  }

  /**
   * Delete ingredient by index (for backward compatibility)
   */
  deleteIngredient(index: number): Observable<boolean> {
    const ingredient = this.ingredients[index];
    if (ingredient && ingredient.id) {
      return this.deleteIngredientById(ingredient.id);
    } else {
      // If no ID, just remove from local array
      this.ingredients.splice(index, 1);
      this.ingredientsChanged.next(this.ingredients.slice());
      return new Observable(observer => {
        observer.next(true);
        observer.complete();
      });
    }
  }

  /**
   * Delete ingredient by ID
   */
  deleteIngredientById(id: string): Observable<boolean> {
    return this.indexedDBService.deleteShoppingListIngredient(id).pipe(
      tap(() => {
        const index = this.ingredients.findIndex(ingredient => ingredient.id === id);
        if (index !== -1) {
          this.ingredients.splice(index, 1);
          this.ingredientsChanged.next(this.ingredients.slice());
        }
      })
    );
  }

  /**
   * Delete all ingredients
   */
  deleteAll(): Observable<boolean> {
    return this.indexedDBService.clearAllShoppingListIngredients().pipe(
      tap(() => {
        this.ingredients.splice(0, this.ingredients.length);
        this.ingredientsChanged.next(this.ingredients.slice());
      })
    );
  }

  /**
   * Refresh ingredients from IndexedDB
   */
  refreshIngredients(): void {
    this.loadIngredientsFromDB();
  }
}
