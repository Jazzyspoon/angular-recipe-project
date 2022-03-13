import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Post } from './post.model';
import { pipe } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PostService {
  loadedPosts: Post[] = [];
  constructor(private http: HttpClient) {}
  createAndStoreRecipes(
    name: string,
    description: string,
    imagePath: string,
    ingredients: [
      {
        name: string;
        amount: number;
        uom: string;
      }
    ],
    instructions: string,
    id: string
  ) {
    const postData: Post = {
      name,
      description,
      imagePath,
      ingredients,
      instructions,
      id,
    };
    this.http
      .post(
        'https://pottorff-recipe-book-default-rtdb.firebaseio.com/posts.json',
        postData
      )
      .subscribe((response) => {
        console.log(response);
      });
  }
  getRecipes() {
    this.http
      .get<{ [key: string]: Post }>(
        'https://pottorff-recipe-book-default-rtdb.firebaseio.com/posts.json'
      )
      .pipe(
        map((responseData: { [key: string]: Post }) => {
          const postArray = [];
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
}
