import axios from "axios";

/**
 * Client HTTP central, prêt à être branché sur le backend NestJS.
 * Toutes les requêtes des modules (features/*) passent par ce client.
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Injecte automatiquement le token d'authentification (JWT) si présent.
apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("sgas_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Gestion centralisée des erreurs (401 -> déconnexion, etc.)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem("sgas_token");
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
