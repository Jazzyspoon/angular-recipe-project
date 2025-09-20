import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from, throwError } from 'rxjs';
import { Recipe } from '../recipes-component/recipe.model';
import { Ingredient } from './ingredient.model';

export interface RecipeWithId extends Recipe {
  id?: string;
}

export interface IngredientWithId extends Ingredient {
  id?: string;
}

@Injectable({
  providedIn: 'root'
})
export class IndexedDBService {
  private dbName = 'RecipeBookDB';
  private dbVersion = 1;
  private db: IDBDatabase | null = null;
  private dbReady = new BehaviorSubject<boolean>(false);

  constructor() {
    this.initDB();
  }

  /**
   * Initialize IndexedDB database
   */
  private initDB(): void {
    if (!window.indexedDB) {
      console.error('IndexedDB is not supported by this browser');
      return;
    }

    const request = indexedDB.open(this.dbName, this.dbVersion);

    request.onerror = (event) => {
      console.error('Database error:', (event.target as IDBOpenDBRequest).error);
    };

    request.onsuccess = (event) => {
      this.db = (event.target as IDBOpenDBRequest).result;
      this.dbReady.next(true);
      console.log('Database opened successfully');
    };

    request.onupgradeneeded = (event) => {
      this.db = (event.target as IDBOpenDBRequest).result;

      // Create recipes object store
      if (!this.db.objectStoreNames.contains('recipes')) {
        const recipeStore = this.db.createObjectStore('recipes', {
          keyPath: 'id',
          autoIncrement: false
        });

        // Create indexes for searching
        recipeStore.createIndex('name', 'name', { unique: false });
        recipeStore.createIndex('description', 'description', { unique: false });
      }

      // Create shopping list ingredients object store
      if (!this.db.objectStoreNames.contains('shoppingList')) {
        const shoppingListStore = this.db.createObjectStore('shoppingList', {
          keyPath: 'id',
          autoIncrement: false
        });

        // Create indexes for searching
        shoppingListStore.createIndex('name', 'name', { unique: false });
        shoppingListStore.createIndex('uom', 'uom', { unique: false });
      }

      console.log('Database setup complete');
    };
  }

  /**
   * Wait for database to be ready
   */
  private waitForDB(): Observable<boolean> {
    return this.dbReady.asObservable();
  }

  /**
   * Generate unique ID for recipes
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Get all recipes from IndexedDB
   */
  getAllRecipes(): Observable<RecipeWithId[]> {
    return new Observable(observer => {
      if (!this.db) {
        this.waitForDB().subscribe(ready => {
          if (ready) {
            this.performGetAllRecipes(observer);
          }
        });
      } else {
        this.performGetAllRecipes(observer);
      }
    });
  }

  private performGetAllRecipes(observer: any): void {
    const transaction = this.db!.transaction(['recipes'], 'readonly');
    const store = transaction.objectStore('recipes');
    const request = store.getAll();

    request.onsuccess = () => {
      const recipes = (request.result || []).map((recipeData: any) =>
        new Recipe(
          recipeData.name,
          recipeData.description,
          recipeData.imagePath,
          recipeData.ingredients || [],
          recipeData.instructions,
          recipeData.id,
          recipeData.steps
        )
      );
      observer.next(recipes);
      observer.complete();
    };

    request.onerror = () => {
      observer.error('Failed to fetch recipes');
    };
  }

  /**
   * Get a single recipe by ID
   */
  getRecipe(id: string): Observable<RecipeWithId | null> {
    return new Observable(observer => {
      if (!this.db) {
        this.waitForDB().subscribe(ready => {
          if (ready) {
            this.performGetRecipe(id, observer);
          }
        });
      } else {
        this.performGetRecipe(id, observer);
      }
    });
  }

  private performGetRecipe(id: string, observer: any): void {
    const transaction = this.db!.transaction(['recipes'], 'readonly');
    const store = transaction.objectStore('recipes');
    const request = store.get(id);

    request.onsuccess = () => {
      const recipeData = request.result;
      if (recipeData) {
        const recipe = new Recipe(
          recipeData.name,
          recipeData.description,
          recipeData.imagePath,
          recipeData.ingredients || [],
          recipeData.instructions,
          recipeData.id,
          recipeData.steps
        );
        observer.next(recipe);
      } else {
        observer.next(null);
      }
      observer.complete();
    };

    request.onerror = () => {
      observer.error('Failed to fetch recipe');
    };
  }

  /**
   * Add a new recipe to IndexedDB
   */
  addRecipe(recipe: Recipe): Observable<RecipeWithId> {
    return new Observable(observer => {
      const recipeWithId = new Recipe(
        recipe.name,
        recipe.description,
        recipe.imagePath,
        recipe.ingredients,
        recipe.instructions,
        this.generateId(),
        recipe.steps
      ) as RecipeWithId;

      if (!this.db) {
        this.waitForDB().subscribe(ready => {
          if (ready) {
            this.performAddRecipe(recipeWithId, observer);
          }
        });
      } else {
        this.performAddRecipe(recipeWithId, observer);
      }
    });
  }

  private performAddRecipe(recipe: RecipeWithId, observer: any): void {
    const transaction = this.db!.transaction(['recipes'], 'readwrite');
    const store = transaction.objectStore('recipes');
    const request = store.add(recipe);

    request.onsuccess = () => {
      observer.next(recipe);
      observer.complete();
    };

    request.onerror = () => {
      observer.error('Failed to add recipe');
    };
  }

  /**
   * Update an existing recipe
   */
  updateRecipe(recipe: RecipeWithId): Observable<RecipeWithId> {
    return new Observable(observer => {
      if (!recipe.id) {
        observer.error('Recipe ID is required for update');
        return;
      }

      if (!this.db) {
        this.waitForDB().subscribe(ready => {
          if (ready) {
            this.performUpdateRecipe(recipe, observer);
          }
        });
      } else {
        this.performUpdateRecipe(recipe, observer);
      }
    });
  }

  private performUpdateRecipe(recipe: RecipeWithId, observer: any): void {
    const transaction = this.db!.transaction(['recipes'], 'readwrite');
    const store = transaction.objectStore('recipes');
    const request = store.put(recipe);

    request.onsuccess = () => {
      observer.next(recipe);
      observer.complete();
    };

    request.onerror = () => {
      observer.error('Failed to update recipe');
    };
  }

  /**
   * Delete a recipe by ID
   */
  deleteRecipe(id: string): Observable<boolean> {
    return new Observable(observer => {
      if (!this.db) {
        this.waitForDB().subscribe(ready => {
          if (ready) {
            this.performDeleteRecipe(id, observer);
          }
        });
      } else {
        this.performDeleteRecipe(id, observer);
      }
    });
  }

  private performDeleteRecipe(id: string, observer: any): void {
    const transaction = this.db!.transaction(['recipes'], 'readwrite');
    const store = transaction.objectStore('recipes');
    const request = store.delete(id);

    request.onsuccess = () => {
      observer.next(true);
      observer.complete();
    };

    request.onerror = () => {
      observer.error('Failed to delete recipe');
    };
  }

  /**
   * Clear all recipes (useful for testing or reset)
   */
  clearAllRecipes(): Observable<boolean> {
    return new Observable(observer => {
      if (!this.db) {
        this.waitForDB().subscribe(ready => {
          if (ready) {
            this.performClearAllRecipes(observer);
          }
        });
      } else {
        this.performClearAllRecipes(observer);
      }
    });
  }

  private performClearAllRecipes(observer: any): void {
    const transaction = this.db!.transaction(['recipes'], 'readwrite');
    const store = transaction.objectStore('recipes');
    const request = store.clear();

    request.onsuccess = () => {
      observer.next(true);
      observer.complete();
    };

    request.onerror = () => {
      observer.error('Failed to clear recipes');
    };
  }

  /**
   * Search recipes by name or description
   */
  searchRecipes(searchTerm: string): Observable<RecipeWithId[]> {
    return new Observable(observer => {
      if (!this.db) {
        this.waitForDB().subscribe(ready => {
          if (ready) {
            this.performSearchRecipes(searchTerm, observer);
          }
        });
      } else {
        this.performSearchRecipes(searchTerm, observer);
      }
    });
  }

  private performSearchRecipes(searchTerm: string, observer: any): void {
    const transaction = this.db!.transaction(['recipes'], 'readonly');
    const store = transaction.objectStore('recipes');
    const request = store.getAll();

    request.onsuccess = () => {
      const allRecipes = request.result || [];
      const filteredRecipes = allRecipes.filter((recipe: RecipeWithId) =>
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      observer.next(filteredRecipes);
      observer.complete();
    };

    request.onerror = () => {
      observer.error('Failed to search recipes');
    };
  }

  // ==================== SHOPPING LIST METHODS ====================

  /**
   * Get all shopping list ingredients from IndexedDB
   */
  getAllShoppingListIngredients(): Observable<IngredientWithId[]> {
    return new Observable(observer => {
      if (!this.db) {
        this.waitForDB().subscribe(ready => {
          if (ready) {
            this.performGetAllShoppingListIngredients(observer);
          }
        });
      } else {
        this.performGetAllShoppingListIngredients(observer);
      }
    });
  }

  private performGetAllShoppingListIngredients(observer: any): void {
    const transaction = this.db!.transaction(['shoppingList'], 'readonly');
    const store = transaction.objectStore('shoppingList');
    const request = store.getAll();

    request.onsuccess = () => {
      const ingredients = (request.result || []).map((ingredientData: any) =>
        new Ingredient(
          ingredientData.name,
          ingredientData.amount,
          ingredientData.uom,
          ingredientData.id
        )
      );
      observer.next(ingredients);
      observer.complete();
    };

    request.onerror = () => {
      observer.error('Failed to fetch shopping list ingredients');
    };
  }

  /**
   * Get a single shopping list ingredient by ID
   */
  getShoppingListIngredient(id: string): Observable<IngredientWithId | null> {
    return new Observable(observer => {
      if (!this.db) {
        this.waitForDB().subscribe(ready => {
          if (ready) {
            this.performGetShoppingListIngredient(id, observer);
          }
        });
      } else {
        this.performGetShoppingListIngredient(id, observer);
      }
    });
  }

  private performGetShoppingListIngredient(id: string, observer: any): void {
    const transaction = this.db!.transaction(['shoppingList'], 'readonly');
    const store = transaction.objectStore('shoppingList');
    const request = store.get(id);

    request.onsuccess = () => {
      const ingredientData = request.result;
      if (ingredientData) {
        const ingredient = new Ingredient(
          ingredientData.name,
          ingredientData.amount,
          ingredientData.uom,
          ingredientData.id
        );
        observer.next(ingredient);
      } else {
        observer.next(null);
      }
      observer.complete();
    };

    request.onerror = () => {
      observer.error('Failed to fetch shopping list ingredient');
    };
  }

  /**
   * Add a new ingredient to shopping list
   */
  addShoppingListIngredient(ingredient: Ingredient): Observable<IngredientWithId> {
    return new Observable(observer => {
      const ingredientWithId = new Ingredient(
        ingredient.name,
        ingredient.amount,
        ingredient.uom,
        this.generateId()
      ) as IngredientWithId;

      if (!this.db) {
        this.waitForDB().subscribe(ready => {
          if (ready) {
            this.performAddShoppingListIngredient(ingredientWithId, observer);
          }
        });
      } else {
        this.performAddShoppingListIngredient(ingredientWithId, observer);
      }
    });
  }

  private performAddShoppingListIngredient(ingredient: IngredientWithId, observer: any): void {
    const transaction = this.db!.transaction(['shoppingList'], 'readwrite');
    const store = transaction.objectStore('shoppingList');
    const request = store.add(ingredient);

    request.onsuccess = () => {
      observer.next(ingredient);
      observer.complete();
    };

    request.onerror = () => {
      observer.error('Failed to add shopping list ingredient');
    };
  }

  /**
   * Update an existing shopping list ingredient
   */
  updateShoppingListIngredient(ingredient: IngredientWithId): Observable<IngredientWithId> {
    return new Observable(observer => {
      if (!ingredient.id) {
        observer.error('Ingredient ID is required for update');
        return;
      }

      if (!this.db) {
        this.waitForDB().subscribe(ready => {
          if (ready) {
            this.performUpdateShoppingListIngredient(ingredient, observer);
          }
        });
      } else {
        this.performUpdateShoppingListIngredient(ingredient, observer);
      }
    });
  }

  private performUpdateShoppingListIngredient(ingredient: IngredientWithId, observer: any): void {
    const transaction = this.db!.transaction(['shoppingList'], 'readwrite');
    const store = transaction.objectStore('shoppingList');
    const request = store.put(ingredient);

    request.onsuccess = () => {
      observer.next(ingredient);
      observer.complete();
    };

    request.onerror = () => {
      observer.error('Failed to update shopping list ingredient');
    };
  }

  /**
   * Delete a shopping list ingredient by ID
   */
  deleteShoppingListIngredient(id: string): Observable<boolean> {
    return new Observable(observer => {
      if (!this.db) {
        this.waitForDB().subscribe(ready => {
          if (ready) {
            this.performDeleteShoppingListIngredient(id, observer);
          }
        });
      } else {
        this.performDeleteShoppingListIngredient(id, observer);
      }
    });
  }

  private performDeleteShoppingListIngredient(id: string, observer: any): void {
    const transaction = this.db!.transaction(['shoppingList'], 'readwrite');
    const store = transaction.objectStore('shoppingList');
    const request = store.delete(id);

    request.onsuccess = () => {
      observer.next(true);
      observer.complete();
    };

    request.onerror = () => {
      observer.error('Failed to delete shopping list ingredient');
    };
  }

  /**
   * Clear all shopping list ingredients
   */
  clearAllShoppingListIngredients(): Observable<boolean> {
    return new Observable(observer => {
      if (!this.db) {
        this.waitForDB().subscribe(ready => {
          if (ready) {
            this.performClearAllShoppingListIngredients(observer);
          }
        });
      } else {
        this.performClearAllShoppingListIngredients(observer);
      }
    });
  }

  private performClearAllShoppingListIngredients(observer: any): void {
    const transaction = this.db!.transaction(['shoppingList'], 'readwrite');
    const store = transaction.objectStore('shoppingList');
    const request = store.clear();

    request.onsuccess = () => {
      observer.next(true);
      observer.complete();
    };

    request.onerror = () => {
      observer.error('Failed to clear shopping list ingredients');
    };
  }

  /**
   * Add multiple ingredients to shopping list (for recipe ingredients)
   */
  addMultipleShoppingListIngredients(ingredients: Ingredient[]): Observable<IngredientWithId[]> {
    return new Observable(observer => {
      const ingredientsWithIds = ingredients.map(ingredient =>
        new Ingredient(
          ingredient.name,
          ingredient.amount,
          ingredient.uom,
          this.generateId()
        ) as IngredientWithId
      );

      if (!this.db) {
        this.waitForDB().subscribe(ready => {
          if (ready) {
            this.performAddMultipleShoppingListIngredients(ingredientsWithIds, observer);
          }
        });
      } else {
        this.performAddMultipleShoppingListIngredients(ingredientsWithIds, observer);
      }
    });
  }

  private performAddMultipleShoppingListIngredients(ingredients: IngredientWithId[], observer: any): void {
    const transaction = this.db!.transaction(['shoppingList'], 'readwrite');
    const store = transaction.objectStore('shoppingList');
    let completed = 0;
    const results: IngredientWithId[] = [];

    if (ingredients.length === 0) {
      observer.next([]);
      observer.complete();
      return;
    }

    ingredients.forEach((ingredient, index) => {
      const request = store.add(ingredient);

      request.onsuccess = () => {
        results[index] = ingredient;
        completed++;
        if (completed === ingredients.length) {
          observer.next(results);
          observer.complete();
        }
      };

      request.onerror = () => {
        observer.error(`Failed to add ingredient: ${ingredient.name}`);
      };
    });
  }
}
