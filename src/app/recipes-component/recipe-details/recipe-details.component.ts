import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Recipe, RecipeStep } from '../recipe.model';
import { RecipeServices } from '../recipe.service';
@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.css'],
})
export class RecipeDetailsComponent implements OnInit {
  recipe: Recipe;
  id: string;
  showToast = false;
  toastMessage = '';

  constructor(
    private recipeService: RecipeServices,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.recipe = this.recipeService.getRecipeById(this.id);

      // If recipe not found, navigate back to recipes
      if (!this.recipe) {
        this.router.navigate(['/recipes']);
      }
    });
  }

  onAddToShoppingList() {
    this.onAddAllIngredientsToShoppingList();
  }

  /**
   * Add all ingredients to shopping list
   */
  onAddAllIngredientsToShoppingList() {
    this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients).subscribe({
      next: () => {
        console.log('All ingredients added to shopping list successfully');
        this.showToastNotification(`All ${this.recipe.ingredients.length} ingredients added to shopping list!`);
      },
      error: (error) => {
        console.error('Failed to add ingredients to shopping list:', error);
        this.showToastNotification('Failed to add ingredients. Please try again.', true);
      }
    });
  }

  /**
   * Add a single ingredient to shopping list
   */
  onAddIngredientToShoppingList(ingredient: any, index?: number) {
    this.recipeService.addIngredientsToShoppingList([ingredient]).subscribe({
      next: () => {
        console.log(`${ingredient.name} added to shopping list successfully`);

        // Show toast notification
        this.showToastNotification(`${ingredient.name} added to shopping list!`);

        // Add visual feedback to button
        if (index !== undefined) {
          this.animateButton(`ingredient-btn-${index}`);
        }
      },
      error: (error) => {
        console.error('Failed to add ingredient to shopping list:', error);
        this.showToastNotification('Failed to add ingredient. Please try again.', true);
      }
    });
  }
  onEditRecipe() {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }
  onDeleteRecipe() {
    this.recipeService.deleteRecipeById(this.id).subscribe({
      next: () => {
        this.router.navigate(['/recipes']);
      },
      error: (error) => {
        console.error('Failed to delete recipe:', error);
        // You could add user notification here
      }
    });
  }

  /**
   * Get recipe steps for display
   */
  getRecipeSteps(): RecipeStep[] {
    return this.recipe ? this.recipe.getStepsArray() : [];
  }

  /**
   * Print the recipe
   */
  onPrintRecipe(): void {
    window.print();
  }

  /**
   * Get current date for print header
   */
  getCurrentDate(): string {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Show toast notification
   */
  showToastNotification(message: string, isError: boolean = false): void {
    this.toastMessage = message;
    this.showToast = true;

    // Auto-hide toast after 3 seconds
    setTimeout(() => {
      this.hideToast();
    }, 3000);
  }

  /**
   * Hide toast notification
   */
  hideToast(): void {
    this.showToast = false;
  }

  /**
   * Animate button to show feedback
   */
  animateButton(buttonId: string): void {
    const button = document.getElementById(buttonId);
    if (button) {
      button.classList.add('btn-added');

      // Remove animation class after animation completes
      setTimeout(() => {
        button.classList.remove('btn-added');
      }, 600);
    }
  }
}
