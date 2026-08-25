import API from './api';
import type { Category, CreateCategoryDTO, UpdateCategoryDTO } from '../types/product';

// 1. Obtener todas las categorías (GET)
export async function getAllCategories(): Promise<Category[]> {
  const response = await API.get<Category[]>('/categories');
  return response.data;
}

// 2. Obtener una categoría por ID (GET)
export async function getCategoryById(id: string): Promise<Category> {
  const response = await API.get<Category>(`/categories/${id}`);
  return response.data;
}

// 3. Crear una nueva categoría (POST)
export async function createCategory(payload: CreateCategoryDTO): Promise<Category> {
  const response = await API.post<Category>('/categories', payload);
  return response.data;
}

// 4. Actualizar una categoría existente (PATCH)
export async function updateCategory(id: string, payload: UpdateCategoryDTO): Promise<Category> {
  const response = await API.patch<Category>(`/categories/${id}`, payload);
  return response.data;
}

// 5. Eliminar una categoría (DELETE)
export async function deleteCategory(id: string): Promise<void> {
  await API.delete(`/categories/${id}`);
}