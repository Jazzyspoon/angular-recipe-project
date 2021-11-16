import { Component, OnInit } from '@angular/core';

import { Recipe } from './recipe.model';
import { RecipeServices } from './recipe.service';

@Component({
  selector: 'app-recipes-component',
  templateUrl: './recipes-component.component.html',
  styleUrls: ['./recipes-component.component.css'],
  providers: [RecipeServices],
})
export class RecipesComponentComponent implements OnInit {
  selectedRecipe: Recipe;

  constructor(private recipeServices: RecipeServices) {}

  ngOnInit(): void {
    this.recipeServices.recipeSelected.subscribe((recipe: Recipe) => {
      this.selectedRecipe = recipe;
    });
  }
}
