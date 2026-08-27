// como necesito traer la informacion de usuario llamoo la carpeta de user y ahora establezco toda la inf que necesito 
import type { User} from "./user";


// el usuario se registra y se pide estas variables 
export interface RegisterCredentials {
    name:string;
    email:string;
    password:string;
}

// cuando ya este regisrado ya puede hacer login
export interface LoginCredentials{
    email:string;
    password:string;
}


//cuando el usuario hace login se autentica y se le da el token
export interface AuthResponse{
    accessToken: string;
    user: User
}

// inf cuando al usuario se le pida cambiar de contraseña 
export interface ChangePasswordRequest{
    currentPassword:string;
    newPassword:string;
}