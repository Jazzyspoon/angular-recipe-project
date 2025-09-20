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
    this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients).subscribe({
      next: () => {
        // You could add a success notification here
        console.log('Ingredients added to shopping list successfully');
      },
      error: (error) => {
        console.error('Failed to add ingredients to shopping list:', error);
        // You could add user notification here
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
}
