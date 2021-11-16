import { Component, OnInit } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';

@Component({
  selector: 'app-shoppinglist-component',
  templateUrl: './shoppinglist-component.component.html',
  styleUrls: ['./shoppinglist-component.component.css'],
})
export class ShoppinglistComponentComponent implements OnInit {
  ingredients: Ingredient[];
  constructor() {}

  ngOnInit(): void {}

  onIngredientAdded(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
  }
}
