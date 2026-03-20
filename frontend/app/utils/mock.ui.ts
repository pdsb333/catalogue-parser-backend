import { BodyLogin, TokenSchema, UserOut, CategorieRead, CategorieWithParsers, ParserCreate, ParserRead, HTTPValidationError } from "./schema.ui";

/** * Note : Si CategorieWithParsers n'est pas bien défini dans schema.ui, 
 * garde cette interface ici, sinon supprime-la pour éviter les doublons.
 */
export interface CategorieWithParsersFull extends CategorieRead {
  parsers: ParserRead[];
}

/** Mock pour une tentative de connexion réussie */
export const mockLoginRequest: BodyLogin = {
  grant_type: "password",
  username: "admin@example.com",
  password: "securePassword123",
  scope: "read write",
  client_id: null,
  client_secret: null
};

/** Mock de la réponse après authentification */
export const mockTokenResponse: TokenSchema = {
  access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  token_type: "bearer"
};

/** Mock d'un utilisateur en sortie (UserOut) */
export const mockUserOut: UserOut = {
  email: "admin@example.com"
};

/** Mock d'une liste de catégories (CategorieRead) */
export const mockCategories: CategorieRead[] = [
  { id: 1, name: "E-commerce", admin_id: 10 },
  { id: 2, name: "News Aggregator", admin_id: 10 },
  { id: 3, name: "Social Media", admin_id: 12 }
];

// --- LA PARTIE MANQUANTE QUI CAUSAIT L'ERREUR ---

/** Mock d'une liste de catégories avec leurs parsers (Tableau d'objets) */
export const mockCategoriesWithParsers: CategorieWithParsersFull[] = [
  {
    id: 1,
    name: "E-commerce",
    admin_id: 10,
    parsers: [
      {
        id: 101,
        name: "Amazon Scraper",
        categorie_id: 1,
        admin_id: 10,
        extra_properties: { region: "FR", timeout: 5000 }
      },
      {
        id: 102,
        name: "eBay Parser",
        categorie_id: 1,
        admin_id: 10,
        extra_properties: {}
      }
    ]
  },
  {
    id: 2,
    name: "News Aggregator",
    admin_id: 10,
    parsers: [
      {
        id: 201,
        name: "News RSS Bot",
        categorie_id: 2,
        admin_id: 10,
        extra_properties: { url: "https://news.example.com/rss" }
      }
    ]
  }
];

// --- FIN DU FIX ---

/** Mock pour la création d'un parser */
export const mockParserCreate: ParserCreate = {
  name: "New Custom Parser",
  categorie_id: 2,
  extra_properties: {
    user_agent: "Mozilla/5.0",
    retry_count: 3
  }
};

/** Mock pour la lecture d'un parser */
export const mockParserRead: ParserRead = {
  id: 201,
  name: "News RSS Bot",
  categorie_id: 2,
  admin_id: 10,
  extra_properties: {
    url: "https://news.example.com/rss",
    frequency: "hourly"
  }
};

/** Mock d'une erreur de validation */
export const mockValidationError: HTTPValidationError = {
  detail: [
    {
      loc: ["body", "password"],
      msg: "ensure this value has at least 8 characters",
      type: "value_error.any_str.min_length"
    }
  ]
};

/** Mock d'une erreur de paramètre manquant dans l'URL */
export const mockPathError: HTTPValidationError = {
  detail: [
    {
      loc: ["path", "categorie_id"],
      msg: "value is not a valid integer",
      type: "type_error.integer"
    }
  ]
};

