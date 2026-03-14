# 📚 Catalogue de Parsers - Backend

Ce projet est une API REST construite avec FastAPI permettant de centraliser, gérer et rechercher des parsers pour Fluent Bit et Fluentd. L'application est destinée aux administrateurs dans sa version 1, avec une authentification sécurisée.

## 🚀 Fonctionnalités principales

- CRUD complet sur les parsers
- Catégorisation des parsers par type
- Authentification des administrateurs (V1)
- Tests unitaires et d'intégration
- CI/CD avec GitLab + Alembic

---

## 🛠️ Stack technique

| Composant         | Technologie              |
|------------------|--------------------------|
| Backend API      | FastAPI                  |
| ORM              | SQLModel                 |
| Base de données  | PostgreSQL (via Docker)  |
| Migrations       | Alembic                  |
| Authentification | JWT (ou login classique) |
| Tests            | Pytest, MagicMock        |
| CI/CD            | GitLab CI                |
| Conteneurisation | Docker / Docker Compose  |

---

## 🧱 Modèles de données

- **User**
  - `id`, `email`, `mot_de_passe`
- **Categorie**
  - `id`, `nom`
- **Parser**
  - `id`, `nom`, `description`, `contenu`, `type_id`, `admin_id`

---

## 📦 Installation locale

1. **Cloner le dépôt :**

```bash
git clone https://gitlab.com/ton-projet/catalogue-parsers.git
cd catalogue-parsers/
```

2. **Créer un fichier .env à la racine du projet avec les variables suivantes :**

```env
POSTGRES_USER=myuser
POSTGRES_PASSWORD=mypassword
POSTGRES_DB=mydatabase
DATABASE_URL=postgresql+psycopg2://myuser:mypassword@postgres:5432/mydatabase
DATABASE_URL_TEST=postgresql+psycopg2://test_user:test_pass@db_test:5432/test_db
JWT_SECRET_KEY=nimportequellechainehashed
JWT_REFRESH_SECRET_KEY=nimportequelchainemaisdifferentedelautreducoup
```
3. **Lancer le projet :**

```bash
docker compose up --build 
```

4. **Lancer les migrations Alembic  :**

```bash
alembic upgrade head
```

5. **Un fichier seed est disponible pour avoir des données de test  :**

```bash
python -m app.seed
```

4. **La documentation du swagger est disponible a l'url :**

 - http://localhost:8080/docs

## 🔬 Lancer les tests

Par défaut, les dépendances de test sont installées lors du build de l’image.  
Pour désactiver ce comportement, retirez les lignes suivantes du Dockerfile :

```dockerfile
COPY requirements/test.txt .
RUN pip install -r test.txt
```

Une base de données spécifique est configurée pour les tests. Pour les exécuter :

```bash
pytest -v 
```

## 📁 Structure du projet

```markdown

backend/
├── app/
│   ├── routes/         # Routes FastAPI
│   ├── core/           # Configuration (settings, sécurité)
│   ├── models/         # Modèles SQLModel
│   ├── schemas/        # Schémas Pydantic
│   ├── services/       # Logique métier
│   ├── main.py         # Point d'entrée de l'app
│   ├── seed.py         # Données de tests
├── requirements/
│   ├── base.txt        # Dépendances principales
│   ├── test.txt        # Dépendances de test
├── tests/              # Tests unitaires et d'intégration
├── alembic/            # Migrations Alembic
├── alembic.ini         # Config Alembic
├── Dockerfile
├── .gitignore
├── docker-compose.yaml
├── README.md

```

 ## 📦 CI/CD

Fichier .gitlab-ci.yml configuré pour :

 - Lancer les tests
 - Appliquer les migrations Alembic