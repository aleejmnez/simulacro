import { api } from "../lib/axiosConfig";
import type { Category, CreateCategoryPayload, UpdateCategoryPayload  } from "../types/category";


export async function getAllcategories():Promise <Category[]> {
    try {
        const response = await api.get<Category[]>('/categories');
        return response.data

    } catch (error) {
        throw new Error('Ey aca no hay nada')
        
    }
}


export async function CreateCategory(payload: CreateCategoryPayload):Promise <Category> {
    try {
        const response = await api.post<Category>('/categories', payload);
        return response.data

    } catch (error) {
        throw new Error('Ey aca no hay nada')
        
    }
}

export async function UpdateCategory(id: string, payload:UpdateCategoryPayload): Promise<Category> {
    try {
        const response = await api.patch<Category>(`/categories/${id}`, payload);
        return response.data;
    } catch (error) {
        throw new Error('Ey valemía esa vainano ejta')
    }
}

export async function DeleteCategory(id: string): Promise<void> {
    try {
        const response = await api.delete<Category>(`/categories/${id}`);
        return response.data;
    } catch (error) {
        throw new Error('Ey valemía esa vainano ejta')
    }
}