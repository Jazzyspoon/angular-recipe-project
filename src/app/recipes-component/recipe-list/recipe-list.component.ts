import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Recipe } from '../recipe.model';
@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
})
export class RecipeListComponent implements OnInit {
  @Output() recipeWasSelected = new EventEmitter<Recipe>();

  recipes: Recipe[] = [
    new Recipe(
      'TEST RECIPE 1',
      'TEST DESCRIPTION',
      'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/slow-cooker-spanish-chicken-4b787a1.jpg?quality=90&webp=true&resize=375,341'
    ),
    new Recipe(
      'Another Test recipe 2',
      'Test Description',
      'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/slow-cooker-spanish-chicken-4b787a1.jpg?quality=90&webp=true&resize=375,341'
    ),
  ];

  constructor() {}

  ngOnInit(): void {}

  onRecipeSelected(recipe: Recipe) {
    this.recipeWasSelected.emit(recipe);
  }
}
