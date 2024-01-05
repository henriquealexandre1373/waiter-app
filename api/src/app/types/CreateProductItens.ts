export type CreateProductItens = {
  name: string;
  description: string;
  price: number;
  category: string;
  ingredients: string[];
  industrialized: boolean;
  imagePath: string | undefined;
}
