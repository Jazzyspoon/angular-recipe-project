import { Component, OnInit } from '@angular/core';
import { IndexedDBService } from './indexeddb.service';
import { Recipe } from '../recipes-component/recipe.model';
import { Ingredient } from './ingredient.model';

@Component({
  selector: 'app-indexeddb-test',
  template: `
    <div class="container mt-4">
      <h3>IndexedDB Test Component</h3>
      
      <div class="row">
        <div class="col-md-6">
          <h4>Test Operations</h4>
          <button class="btn btn-primary me-2" (click)="testAddRecipe()">Add Test Recipe</button>
          <button class="btn btn-info me-2" (click)="testGetAllRecipes()">Get All Recipes</button>
          <button class="btn btn-warning me-2" (click)="testUpdateRecipe()">Update First Recipe</button>
          <button class="btn btn-danger me-2" (click)="testDeleteFirstRecipe()">Delete First Recipe</button>
          <button class="btn btn-secondary" (click)="testClearAll()">Clear All</button>
        </div>
        
        <div class="col-md-6">
          <h4>Results</h4>
          <div class="alert alert-info">
            <pre>{{ testResults | json }}</pre>
          </div>
        </div>
      </div>
      
      <div class="row mt-4">
        <div class="col-12">
          <h4>Current Recipes in IndexedDB</h4>
          <div *ngIf="recipes.length === 0" class="alert alert-warning">
            No recipes found in IndexedDB
          </div>
          <div *ngFor="let recipe of recipes" class="card mb-2">
            <div class="card-body">
              <h5 class="card-title">{{ recipe.name }}</h5>
              <p class="card-text">{{ recipe.description }}</p>
              <small class="text-muted">ID: {{ recipe.id }}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .me-2 {
      margin-right: 0.5rem;
    }
    .mt-4 {
      margin-top: 1.5rem;
    }
    .mb-2 {
      margin-bottom: 0.5rem;
    }
  `]
})
export class IndexedDBTestComponent implements OnInit {
  recipes: any[] = [];
  testResults: any = {};

  constructor(private indexedDBService: IndexedDBService) {}

  ngOnInit(): void {
    this.testGetAllRecipes();
  }

  testAddRecipe(): void {
    const testRecipe = new Recipe(
      'Test Recipe ' + Date.now(),
      'This is a test recipe created by the IndexedDB test component',
      'https://via.placeholder.com/300x200',
      [
        new Ingredient('Test Ingredient 1', 2, 'cups'),
        new Ingredient('Test Ingredient 2', 1, 'tablespoon')
      ],
      'Mix all ingredients together and cook for 30 minutes.'
    );

    this.indexedDBService.addRecipe(testRecipe).subscribe({
      next: (result) => {
        this.testResults = { operation: 'Add Recipe', success: true, result };
        this.testGetAllRecipes(); // Refresh the list
      },
      error: (error) => {
        this.testResults = { operation: 'Add Recipe', success: false, error };
      }
    });
  }

  testGetAllRecipes(): void {
    this.indexedDBService.getAllRecipes().subscribe({
      next: (recipes) => {
        this.recipes = recipes;
        this.testResults = { operation: 'Get All Recipes', success: true, count: recipes.length };
      },
      error: (error) => {
        this.testResults = { operation: 'Get All Recipes', success: false, error };
      }
    });
  }

  testUpdateRecipe(): void {
    if (this.recipes.length === 0) {
      this.testResults = { operation: 'Update Recipe', success: false, error: 'No recipes to update' };
      return;
    }

    const firstRecipe = { ...this.recipes[0] };
    firstRecipe.name = 'Updated Recipe Name - ' + Date.now();
    firstRecipe.description = 'This recipe has been updated by the test component';

    this.indexedDBService.updateRecipe(firstRecipe).subscribe({
      next: (result) => {
        this.testResults = { operation: 'Update Recipe', success: true, result };
        this.testGetAllRecipes(); // Refresh the list
      },
      error: (error) => {
        this.testResults = { operation: 'Update Recipe', success: false, error };
      }
    });
  }

  testDeleteFirstRecipe(): void {
    if (this.recipes.length === 0) {
      this.testResults = { operation: 'Delete Recipe', success: false, error: 'No recipes to delete' };
      return;
    }

    const firstRecipeId = this.recipes[0].id;
    this.indexedDBService.deleteRecipe(firstRecipeId).subscribe({
      next: (result) => {
        this.testResults = { operation: 'Delete Recipe', success: true, result };
        this.testGetAllRecipes(); // Refresh the list
      },
      error: (error) => {
        this.testResults = { operation: 'Delete Recipe', success: false, error };
      }
    });
  }

  testClearAll(): void {
    this.indexedDBService.clearAllRecipes().subscribe({
      next: (result) => {
        this.testResults = { operation: 'Clear All Recipes', success: true, result };
        this.testGetAllRecipes(); // Refresh the list
      },
      error: (error) => {
        this.testResults = { operation: 'Clear All Recipes', success: false, error };
      }
    });
  }
}
