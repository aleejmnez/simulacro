export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface CreateCategoryDTO {
  name: string;
  description?: string;
}

export type UpdateCategoryDTO = Partial<CreateCategoryDTO>;

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  categoryId: string;
  images?: string[];
  category?: Category;
  createdAt: string;
}

export type CreateProductDTO = Omit<Product, 'id' | 'createdAt' | 'category'>;
export type UpdateProductDTO = Partial<CreateProductDTO>;
