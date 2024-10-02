export type ProductType = {
  name: string;
  description: string;
  price: number;
  category: string;
  ingredients: string[];
  industrialized: boolean;
  imagePath?: string;
};

export type FindProductType = Pick<ProductType, 'category' | 'name'>;
