import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shoppinglist.service';

@Component({
  selector: 'app-shoppinglist-component',
  templateUrl: './shoppinglist-component.component.html',
  styleUrls: ['./shoppinglist-component.component.css'],
})
export class ShoppinglistComponentComponent implements OnInit, OnDestroy {
  ingredients: Ingredient[];
  private idChangeSub: Subscription;

  constructor(private slService: ShoppingListService) {}

  ngOnInit() {
    this.ingredients = this.slService.getIngredients();
    this.idChangeSub = this.slService.ingredientsChanged.subscribe(
      (ingredients: Ingredient[]) => {
        this.ingredients = ingredients;
      }
    );
  }
  onEditItem(index: number) {
    this.slService.startedEditing.next(index);
  }

  /**
   * Print the shopping list
   */
  onPrint() {
    window.print();
  }

  /**
   * Reset database (temporary debugging method)
   */
  onResetDatabase(): void {
    // Show confirmation dialog
    const confirmed = confirm(
      '⚠️ WARNING: This will permanently delete ALL your recipes and shopping list items!\n\n' +
      'This action cannot be undone. Are you sure you want to reset the database?'
    );

    if (!confirmed) {
      return; // User cancelled
    }

    console.log('Resetting database...');
    this.slService.resetDatabase().subscribe({
      next: (success) => {
        if (success) {
          console.log('Database reset successfully');
          alert('✅ Database has been reset successfully. The page will now reload.');
          // Reload the page to reinitialize everything
          window.location.reload();
        }
      },
      error: (error) => {
        console.error('Failed to reset database:', error);
        alert('❌ Failed to reset database. Please check the console for details.');
      }
    });
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

  ngOnDestroy(): void {
    this.idChangeSub.unsubscribe();
  }
}
