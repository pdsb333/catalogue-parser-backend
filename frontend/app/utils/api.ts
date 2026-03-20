import { fetchClient } from "./apiClient";
import type { 
  BodyLogin, TokenSchema, 
  CategorieRead, CategorieCreate, CategorieUpdate, CategorieWithParsers,
  ParserRead, ParserCreate, ParserUpdate,
  UserIn, UserOut, UserUpdate 
} from "./schema.ui";

// ==========================================
// 1. AUTHENTIFICATION
// ==========================================
export const authApi = {
  login: async (username: string, password: string): Promise<TokenSchema> => {
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);
    formData.append("grant_type", "password");

    return fetchClient<TokenSchema>("/login/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData,
    });
  }
};

// ==========================================
// 2. CATÉGORIES
// ==========================================
export const categoriesApi = {
  // GET /categories/
  getAll: () => fetchClient<CategorieRead[]>("/categories/"),
  
  // GET /categories/admin
  getAllAdmin: () => fetchClient<CategorieRead[]>("/categories/admin"),
  
  // GET /categories/parsers
  getHierarchical: () => fetchClient<CategorieWithParsers[]>("/categories/parsers"),
  
  // POST /categories/admin
  create: (data: CategorieCreate) => fetchClient<CategorieRead>("/categories/admin", {
    method: "POST",
    body: JSON.stringify(data)
  }),
  
  // PATCH /categories/admin/{id}
  update: (id: number, data: CategorieUpdate) => fetchClient<CategorieRead>(`/categories/admin/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data)
  }),

  // DELETE /categories/admin/{id}
  delete: (id: number) => fetchClient(`/categories/admin/${id}`, {
    method: "DELETE"
  })
};

// ==========================================
// 3. PARSERS
// ==========================================
export const parsersApi = {
  // GET /parsers/admin
  getAllAdmin: (limit = 100, offset = 0) => fetchClient<ParserRead[]>(`/parsers/admin?limit=${limit}&offset=${offset}`),
  
  // GET /parsers/admin/{id}
  getById: (id: number) => fetchClient<ParserRead>(`/parsers/admin/${id}`),

  // GET /parsers/by-categorie/{id}
  getByCategory: (categoryId: number, limit = 100, offset = 0) => 
    fetchClient<ParserRead[]>(`/parsers/by-categorie/${categoryId}?limit=${limit}&offset=${offset}`),
  
  // POST /parsers/admin
  create: (data: ParserCreate) => fetchClient<ParserRead>("/parsers/admin", {
    method: "POST",
    body: JSON.stringify(data)
  }),
  
  // PATCH /parsers/admin/{id}
  update: (id: number, data: ParserUpdate) => fetchClient<ParserRead>(`/parsers/admin/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data)
  }),

  // DELETE /parsers/admin/{id}
  delete: (id: number) => fetchClient(`/parsers/admin/${id}`, {
    method: "DELETE"
  })
};

// ==========================================
// 4. UTILISATEURS
// ==========================================
export const usersApi = {
  // GET /users/
  getAll: () => fetchClient<UserOut[]>("/users/"),
  
  // GET /users/me
  getMe: () => fetchClient<UserOut>("/users/me"),
  
  // POST /users/
  create: (data: UserIn) => fetchClient<UserOut>("/users/", {
    method: "POST",
    body: JSON.stringify(data)
  }),
  
  // PATCH /users/{id}
  update: (email: string, data: UserUpdate) => fetchClient<UserOut>(`/users/${encodeURIComponent(email)}`, {
    method: "PATCH",
    body: JSON.stringify(data)
  }),

  // DELETE /users/{id}
  delete: (email: string) => fetchClient(`/users/${encodeURIComponent(email)}`, {
    method: "DELETE"
  })
};
