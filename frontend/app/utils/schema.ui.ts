/**
 * Représente les données nécessaires pour l'authentification OAuth2.
 */
export interface BodyLogin {
  /** Type de concession (grant). Doit être "password" ou null. */
  grant_type: "password" | null;
  /** Nom d'utilisateur (souvent l'email). */
  username: string;
  /** Mot de passe de l'utilisateur. */
  password: string;
  /** Étendue des permissions demandées. @default "" */
  scope?: string;
  /** Identifiant optionnel du client. */
  client_id?: string | null;
  /** Secret optionnel du client. */
  client_secret?: string | null;
}

/**
 * Schéma du jeton d'accès retourné après une authentification réussie.
 */
export interface TokenSchema {
  /** Le jeton d'accès JWT. */
  access_token: string;
  /** Le type de jeton. @default "bearer" */
  token_type: string;
}

/**
 * Données d'entrée pour la création d'un utilisateur.
 */
export interface UserIn {
  /** Adresse email valide de l'utilisateur. */
  email: string;
  /** Mot de passe choisi. */
  password: string;
}

/**
 * Données utilisateur retournées par l'API (exclut les données sensibles).
 */
export interface UserOut {
  /** Adresse email de l'utilisateur. */
  email: string;
}

/**
 * Schéma pour la mise à jour des informations utilisateur.
 */
export interface UserUpdate {
  /** Nouvelle adresse email (optionnel). */
  email?: string | null;
  /** Nouveau mot de passe (optionnel). */
  password?: string | null;
}

/**
 * Schéma pour la création d'une nouvelle catégorie.
 */
export interface CategorieCreate {
  /** Nom de la catégorie. */
  name: string;
}

/**
 * Représentation complète d'une catégorie en lecture.
 */
export interface CategorieRead {
  /** Nom de la catégorie. */
  name: string;
  /** Identifiant unique de la catégorie. */
  id: number;
  /** Identifiant de l'administrateur propriétaire. */
  admin_id: number;
}

/**
 * Schéma pour la mise à jour d'une catégorie existante.
 */
export interface CategorieUpdate {
  /** Nouveau nom de la catégorie (optionnel). */
  name?: string | null;
}

/**
 * Détail d'une catégorie incluant la liste de ses parsers associés.
 */
export interface CategorieWithParsers {

  id: any;
  /** Nom de la catégorie. */
  name: string;
  /** Liste des parsers liés à cette catégorie. */
  parsers: Array<{
    /** Nom du parser. */
    name: string;
    /** ID de la catégorie parente. */
    categorie_id: number | null;
    /** Propriétés additionnelles dynamiques. */
    extra_properties?: Record<string, any>;
    /** Identifiant unique du parser. */
    id: number;
    /** Identifiant de l'administrateur propriétaire. */
    admin_id: number;
  }>;
}

/**
 * Schéma pour la création d'un nouveau parser.
 */
export interface ParserCreate {
  /** Nom du parser. */
  name: string;
  /** Identifiant de la catégorie à laquelle le parser est rattaché. */
  categorie_id: number | null;
  /** Configuration additionnelle (objet libre). @default {} */
  extra_properties?: Record<string, any>;
}

/**
 * Représentation complète d'un parser en lecture.
 */
export interface ParserRead {
  /** Nom du parser. */
  name: string;
  /** Identifiant de la catégorie parente. */
  categorie_id: number | null;
  /** Configuration additionnelle. */
  extra_properties?: Record<string, any>;
  /** Identifiant unique du parser. */
  id: number;
  /** Identifiant de l'administrateur propriétaire. */
  admin_id: number;
}

/**
 * Schéma pour la mise à jour d'un parser existant.
 */
export interface ParserUpdate {
  /** Nouveau nom du parser. */
  name?: string | null;
  /** Nouvel identifiant de catégorie. */
  categorie_id?: number | null;
  /** Nouvelles propriétés de configuration. */
  extra_properties?: Record<string, any> | null;
}

/**
 * Détail d'une erreur de validation de champ.
 */
export interface ValidationError {
  /** Chemin vers le champ en erreur (ex: ["body", "password"]). */
  loc: Array<string | number>;
  /** Message d'erreur explicatif. */
  msg: string;
  /** Type d'erreur (ex: "value_error.missing"). */
  type: string;
}

/**
 * Erreur retournée par le serveur en cas de données invalides (HTTP 422).
 */
export interface HTTPValidationError {
  /** Liste des détails d'erreurs de validation. */
  detail?: ValidationError[];
}