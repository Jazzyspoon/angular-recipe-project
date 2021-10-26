import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponentComponent } from './header-component/header-component.component';
import { ShoppinglistComponentComponent } from './shoppinglist-component/shoppinglist-component.component';

import { FooterComponentComponent } from './footer-component/footer-component.component';
import { RecipesComponentComponent } from './recipes-component/recipes-component.component';
import { RecipeListComponent } from './recipes/recipe-list/recipe-list.component';
import { RecipeDetailsComponent } from './recipes-component/recipe-details/recipe-details.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponentComponent,
    ShoppinglistComponentComponent,

    FooterComponentComponent,
    RecipesComponentComponent,
    RecipeListComponent,
    RecipeDetailsComponent,
  ],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
