export interface Post {
  name: string;
  description: string;
  imagePath: string;
  ingredients: [
    {
      name: string;
      amount: number;
      uom: string;
    }
  ];
  instructions: string;
  id?: string;
}
