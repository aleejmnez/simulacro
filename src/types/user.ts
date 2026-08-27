// tipo las variables que me da el backend de usurario y administrador 
export type Role= 'user' | 'admin';

// creo la interface que seria la maqueta de toda la informacion que tiene usuario 
export interface User {
    id:string;
    name:string;
    email:string;
    role:Role;
    createdAt:string;
}