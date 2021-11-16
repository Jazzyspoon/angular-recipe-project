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
      'Chicken Pasta',
      'A delicious, heart-warming meal for the whole family.',
      'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/slow-cooker-spanish-chicken-4b787a1.jpg?quality=90&webp=true&resize=375,341'
    ),
    new Recipe(
      'Avocado bean Soup',
      'This cool, refreshing meal is a fan favorite amongst foodies looking for a nutrient dense meal.',
      'https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fimages.media-allrecipes.com%2Fuserphotos%2F7273647.jpg&w=596&h=596&c=sc&poi=face&q=85'
    ),
  ];

  constructor() {}

  ngOnInit(): void {}

  onRecipeSelected(recipe: Recipe) {
    this.recipeWasSelected.emit(recipe);
  }
}
