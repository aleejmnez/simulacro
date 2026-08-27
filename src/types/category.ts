// creo el tipado de las categorias porque es la informacion que necesito que se muestre 


//maqueta de informacion para las categorias 
export interface Category{
    id:string;
    name:string;
    description?:string;
    createdAt:string;
    updatedAt:string;  
}

// variables que necesito para crear una categoria 
export interface CreateCategoryPayload{
    name:string;
    description?:string;
}


// como ya la categoria estaria creada parcialmente me traeria los datos de createcategory y los guardaria en la variable de updatecategory 
export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;