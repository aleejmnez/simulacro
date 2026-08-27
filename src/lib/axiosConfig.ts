import axios from "axios";
import { tokenStorage } from "./tokenStorage";


export const api = axios.create ({
  baseURL: import.meta.env.VITE_API_URL,
});

// la api intercepta el token en la solicitud 
api.interceptors.request.use((config) => {
  const token = tokenStorage.get (); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    
  }
  return config;
}); 

//la api intercepta la respuesta  y si la persona no esta autorizada para esa solicitud se elimina el token (401 no tiene permisos de autenticacion)
api.interceptors.response.use(
  (response) => response,
  (error) => {
      if (error.response?.status === 401){
        tokenStorage.remove();
      }
      return Promise.reject(error);
  }
);
  
