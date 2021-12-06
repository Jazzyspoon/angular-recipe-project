import { Component, OnInit } from '@angular/core';
import { RecipeServices } from './recipe.service';

@Component({
  selector: 'app-recipes-component',
  templateUrl: './recipes-component.component.html',
  styleUrls: ['./recipes-component.component.css'],
  providers: [RecipeServices],
})
export class RecipesComponentComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
