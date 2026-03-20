/**
 * Base Client FetchWrapper pour interagir avec le backend FastAPI 
 * Base URL: configurable via NEXT_PUBLIC_API_URL (défaut: http://localhost:8000)
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Custom error class pour encapsuler les HTTPValidationError (422) ou autres.
 */
export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(status: number, data: unknown, message?: string) {
    super(message || "API Error");
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

/**
 * Fonction générique de requête qui intercepte automatiquement:
 * 1. L'injection du token Bearer depuis localStorage.
 * 2. La redirection en cas de 401 Unauthorized.
 * 3. Le parsing des erreurs 422 (HTTPValidationError).
 */
export async function fetchClient<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  // Récupérer le token pour l'injection
  let token = null;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("access_token");
  }

  // Fusionner les headers
  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && !(options.body instanceof FormData) && !(options.body instanceof URLSearchParams)) {
    headers.set("Content-Type", "application/json");
  }
  
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  const response = await fetch(url, config);

  // Gestion des réponses non-2xx
  if (!response.ok) {
    // Redirection automatique sur 401
    if (response.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        window.location.href = "/login";
      }
    }

    // Parsing du corps de l'erreur (ex: {"detail": [...]})
    let errorData = null;
    try {
      errorData = await response.json();
    } catch {
      errorData = { detail: response.statusText };
    }

    throw new ApiError(response.status, errorData, response.statusText);
  }

  // 204 No Content ne renvoie pas de JSON 
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}
