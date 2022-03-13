import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Post } from './post.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  loadedPosts: Post[] = [];
  constructor(private http: HttpClient) {}
  ngOnInit() {
    this.onFetchRecipe();
    this.onCreateRecipe();
  }

  onCreateRecipe() {
    this.http
      .post(
        'https://pottorff-recipe-book-default-rtdb.firebaseio.com/recipes.json',
        {
          name: 'INSTANT POT CORNED BEEF AND CABBAGE',
          description:
            'This easy Instant Pot Corned Beef and Cabbage recipe, made with beef brisket, cabbage and carrots comes out so tender and delicious! Perfect for St Patrick’s Day!',
          imagePath:
            'https://www.skinnytaste.com/wp-content/uploads/2019/02/Instant-Pot-Corned-Beef-_-Cabbage-3.jpg',
          ingredients: [
            {
              name: 'trimmed, lean corned beef brisket',
              amount: 2,
              uom: 'Pounds',
            },
            {
              name: 'Cabbage, cut into 6 wedges',
              amount: 1,
              uom: 'medium head of cabbage',
            },
            {
              name: 'carrots, cut into 1/2 inch pieces',
              amount: 3,
              uom: 'medium carrots',
            },
            {
              name: 'frozen pearled onions',
              amount: 0.25,
              uom: 'cup',
            },
            {
              name: 'garlic cloves, minced',
              amount: 2,
              uom: 'cloves',
            },
            {
              name: 'Bay leaves',
              amount: 2,
              uom: 'leaves',
            },
            { name: 'chopped, fresh parsely', amount: 1 / 4, uom: 'cup' },
          ],
          instructions:
            'Place the corned beef brisket, carrots, pearl onions, parsley, bay leaves and peppercorns in the Instant pot and add 3 cups of water. Cover and cook on high pressure 1 1/2 hours. Natural release then open. Add the cabbage to the top, cover and cook on high pressure 3 minutes, quick release. Remove meat and slice into 6 pieces.',
        }
      )
      .subscribe((responseData) => {
        console.log(responseData);
      });
  }

  onFetchRecipe() {
    return this.http
      .get<{ [key: string]: Post }>(
        'https://pottorff-recipe-book-default-rtdb.firebaseio.com/recipes.json'
      )
      .pipe(
        map((responseData: { [key: string]: Post }) => {
          const postArray: Post[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postArray.push({ ...responseData[key], id: key });
            }
          }
          return postArray;
        })
      )
      .subscribe((posts) => {
        this.loadedPosts = posts;
      });
  }

  onDeleteRecipe() {
    this.http
      .delete(
        'https://pottorff-recipe-book-default-rtdb.firebaseio.com/recipes.json'
      )
      .subscribe((responseData) => {
        console.log(responseData);
      });
  }
  onUpdateRecipe() {
    this.http
      .put(
        'https://pottorff-recipe-book-default-rtdb.firebaseio.com/recipes.json',
        {
          name: 'Test',
          description: 'Test',
          imagePath: 'Test',
          ingredients: [],
          instructions: 'Test',
          id: 'Test',
        }
      )
      .subscribe((responseData) => {
        console.log(responseData);
      });
  }
}
