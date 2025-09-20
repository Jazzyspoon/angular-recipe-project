import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shoppinglist.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css'],
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f') slForm: NgForm;
  subscription: Subscription;
  editMode = false;
  editedItemIndex: number;
  editedItem: Ingredient;

  constructor(private slService: ShoppingListService) {}

  ngOnInit() {
    this.subscription = this.slService.startedEditing.subscribe(
      (index: number) => {
        this.editedItemIndex = index;
        this.editMode = true;
        this.editedItem = this.slService.getIngredient(index);
        this.slForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount,
        });
      }
    );
  }
  onSubmit(form: NgForm) {
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount, value.uom);

    if (this.editMode) {
      this.slService.updateIngredient(this.editedItemIndex, newIngredient).subscribe({
        next: () => {
          this.editMode = false;
          form.reset();
        },
        error: (error) => {
          console.error('Failed to update ingredient:', error);
          // You could add user notification here
        }
      });
    } else {
      this.slService.addIngredient(newIngredient).subscribe({
        next: () => {
          this.editMode = false;
          form.reset();
        },
        error: (error) => {
          console.error('Failed to add ingredient:', error);
          // You could add user notification here
        }
      });
    }
  }
  onClear() {
    this.slForm.reset();
    this.editMode = false;
  }

  onDelete() {
    this.slService.deleteIngredient(this.editedItemIndex).subscribe({
      next: () => {
        this.onClear();
      },
      error: (error) => {
        console.error('Failed to delete ingredient:', error);
        // You could add user notification here
      }
    });
  }

  onDeleteAll() {
    this.slService.deleteAll().subscribe({
      next: () => {
        this.onClear();
      },
      error: (error) => {
        console.error('Failed to clear shopping list:', error);
        // You could add user notification here
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
