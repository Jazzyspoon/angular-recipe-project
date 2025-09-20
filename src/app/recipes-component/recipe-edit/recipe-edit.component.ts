import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UntypedFormGroup, UntypedFormControl, UntypedFormArray, Validators } from '@angular/forms';
import { RecipeServices } from '../recipe.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css'],
})
export class RecipeEditComponent implements OnInit {
  id: string;
  editMode = false;
  recipeForm: UntypedFormGroup;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeServices,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.editMode = params['id'] != null;
      this.initForm();
    });
  }
  onSubmit() {
    if (this.editMode) {
      this.recipeService.updateRecipeById(this.id, this.recipeForm.value).subscribe({
        next: () => {
          this.onCancel();
        },
        error: (error) => {
          console.error('Failed to update recipe:', error);
          // You could add user notification here
        }
      });
    } else {
      this.recipeService.addRecipe(this.recipeForm.value).subscribe({
        next: () => {
          this.onCancel();
        },
        error: (error) => {
          console.error('Failed to add recipe:', error);
          // You could add user notification here
        }
      });
    }
  }
  onDeleteIngredient(index: number) {
    (<UntypedFormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onAddIngredient() {
    (<UntypedFormArray>this.recipeForm.get('ingredients')).push(
      new UntypedFormGroup({
        name: new UntypedFormControl(null, Validators.required),
        amount: new UntypedFormControl(null, [
          Validators.required,
          Validators.pattern(/^(0|[1-9]\d*)(\.\d+)?$/),
        ]),
        uom: new UntypedFormControl(null, Validators.required),
      })
    );
  }

  get controls() {
    // a getter!
    return (<UntypedFormArray>this.recipeForm.get('ingredients')).controls;
  }

  private initForm() {
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    let recipeInstructions = '';
    let recipeIngredients = new UntypedFormArray([]);
    if (this.editMode) {
      const recipe = this.recipeService.getRecipeById(this.id);
      if (!recipe) {
        // If recipe not found, navigate back to recipes
        this.router.navigate(['/recipes']);
        return;
      }
      recipeName = recipe.name;
      recipeImagePath = recipe.imagePath;
      recipeDescription = recipe.description;
      recipeInstructions = recipe.instructions;
      if (recipe['ingredients']) {
        for (let ingredient of recipe.ingredients) {
          recipeIngredients.push(
            new UntypedFormGroup({
              name: new UntypedFormControl(ingredient.name, Validators.required),
              amount: new UntypedFormControl(ingredient.amount, [
                Validators.required,
                Validators.pattern(/^(0|[1-9]\d*)(\.\d+)?$/),
              ]),
              uom: new UntypedFormControl(ingredient.uom, Validators.required),
            })
          );
        }
      }
    }
    this.recipeForm = new UntypedFormGroup({
      name: new UntypedFormControl(recipeName, Validators.required),
      imagePath: new UntypedFormControl(recipeImagePath, Validators.required),
      description: new UntypedFormControl(recipeDescription, Validators.required),
      ingredients: recipeIngredients,
      instructions: new UntypedFormControl(recipeInstructions, Validators.required),
    });
  }
}
