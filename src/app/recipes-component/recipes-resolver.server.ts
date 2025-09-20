import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { dataStorageService } from '../shared/data-storage.service';
import { Recipe } from './recipe.model';
import { RecipeServices } from './recipe.service';

@Injectable({
  providedIn: 'root',
})
export class RecipesResolverService  {
  constructor(
    private dataStorageService: dataStorageService,
    private recipeService: RecipeServices
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const recipes = this.recipeService.getRecipes();
    if (recipes.length === 0) {
      return this.dataStorageService.fetchRecipes();
    } else {
      return recipes;
    }
  }
}
