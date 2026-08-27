// creo una token key donde se va a guardar la informacion del acceso del toke que lo obtenga, lo guarde o lo elimine
export const TOKEN_KEY = 'accesToken';

export const tokenStorage ={
    // get obtiene el token y si no hay ninguno es null 
    get:(): string | null => localStorage.getItem(TOKEN_KEY),

    // set se encarga de poner el token en el local storage
    set:(token:string): void => localStorage.setItem(TOKEN_KEY, token),

    //cuidado con las comas siempre ponerlas al final del codigo


    // remove me borra del local storage la llave del token
    remove: ():void => localStorage.removeItem(TOKEN_KEY),  

}

