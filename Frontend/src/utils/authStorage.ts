const TOKEN_KEY = 'auth_token';

export const authStorage = {
  // Obtiene el token independientemente de dónde esté guardado
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
  },

  // Guarda el token según la preferencia del usuario (rememberMe: true/false)
  setToken: (token: string, rememberMe: boolean = true): void => {
    if (rememberMe) {
      localStorage.setItem(TOKEN_KEY, token);
      sessionStorage.removeItem(TOKEN_KEY);
    } else {
      sessionStorage.setItem(TOKEN_KEY, token);
      localStorage.removeItem(TOKEN_KEY);
    }
  },

  // Elimina el token de ambos storage en el Logout
  removeToken: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
  },
};