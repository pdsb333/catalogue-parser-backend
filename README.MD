# 📚 Parsers Catalog - Backend

This project is a REST API built with FastAPI to centralize, manage, and search for Fluent Bit and Fluentd parsers. The application is intended for administrators in version 1, featuring secure authentication.

## 🚀 Key Features

- Full CRUD operations for parsers
- Categorization of parsers by type
- Administrator authentication (V1)
- Unit and integration tests
- CI/CD with GitLab + Alembic

---

## 🛠️ Technical Stack

| Component         | Technology                |
|-------------------|---------------------------|
| Backend API       | FastAPI                   |
| ORM               | SQLModel                  |
| Database          | PostgreSQL (via Docker)   |
| Migrations        | Alembic                   |
| Authentication    | JWT (or classic login)    |
| Tests             | Pytest, MagicMock         |
| CI/CD             | GitLab CI                 |
| Containerization  | Docker / Docker Compose   |

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Docker** (v20.10+)
- **Docker Compose** (v2.0+)
- **Python** (v3.10+ if running outside Docker)

---

## 🧱 Data Models

- **User**
  - `id`, `email`, `password`
- **Category**
  - `id`, `name`
- **Parser**
  - `id`, `name`, `description`, `content`, `type_id`, `admin_id`

---

## 📦 Local Installation

1. **Clone the repository:**

```bash
git clone https://gitlab.com/your-project/parsers-catalog.git
cd parsers-catalog/
```

2. **Create a .env file at the root of the project with the following variables:**

```env
APP_ENV=development # Application environment (development, production)
POSTGRES_USER=myuser # PostgreSQL username
POSTGRES_PASSWORD=mypassword # PostgreSQL password
POSTGRES_DB=mydatabase # PostgreSQL database name
DATABASE_URL=postgresql+psycopg2://myuser:mypassword@postgres:5432/mydatabase # Main database connection string
DATABASE_URL_TEST=postgresql+psycopg2://test_user:test_pass@db_test:5432/test_db # Test database connection string
JWT_SECRET_KEY=anyhashedstring # Secret key for JWT signing
JWT_REFRESH_SECRET_KEY=anotherdifferenthashedstring # Secret key for JWT refresh token signing
FRONTEND_URL=http://localhost:3000 # Allowed CORS origin for frontend
```

3. **Start the project:**

```bash
docker compose up --build 
```

4. **Run Alembic migrations:**

```bash
alembic upgrade head
```

5. **A seed file is available to populate test data:**

```bash
python -m app.seed
```

> ⚠️ The seed script inserts users with hashed passwords. If you need to generate this hash manually, follow this procedure:
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r ./requirements/base.txt
python3 -c "from app.core import hasher_mot_de_passe; print(hasher_mot_de_passe('your_password'))"
```

---

## 📡 API Overview

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/auth/login` | Administrator login | No |
| `GET` | `/parsers/by-categorie/{id}` | List parsers in a category | No |
| `GET` | `/parsers/admin` | List all parsers (detailed) | Yes |
| `POST` | `/parsers/admin` | Create a new parser | Yes |
| `PATCH` | `/parsers/admin/{id}` | Update an existing parser | Yes |
| `DELETE` | `/parsers/admin/{id}` | Remove a parser | Yes |

---

## 📖 API Documentation

The Swagger documentation is available at:
- **Local URL**: [http://localhost:8080/docs](http://localhost:8080/docs)

> ℹ️ Documentation is intentionally left accessible in production for demonstration purposes.

---

## 📝 Example Parser Object

```json
{
  "name": "nginx_access",
  "description": "Nginx access log parser",
  "content": "^(?<remote>[^ ]*) (?<host>[^ ]*) (?<user>[^ ]*) \\[(?<time>[^\\]]*)\\] \"(?<method>\\S+)(?: +(?<path>[^ ]*) +\\S*)?\" (?<code>[^ ]*) (?<size>[^ ]*)(?: \"(?<referer>[^\"]*)\" \"(?<agent>[^\"]*)\")?$",
  "categorie_id": 1
}
```

---

## 🔬 Running Tests

By default, test dependencies are installed during the image build.  
To disable this behavior, remove the following lines from the `Dockerfile`:

```dockerfile
COPY requirements/test.txt .
RUN pip install -r test.txt
```

A dedicated database is configured for testing. To run them:

```bash
pytest -v 
```

## 🛠️ Troubleshooting

- **Database Connection Error**: Ensure the Docker containers are healthy (`docker compose ps`). Check if the `DATABASE_URL` matches the credentials in `.env`.
- **Migration Issues**: If you face errors with Alembic, try running `alembic current` to see the current state of your database schema.
- **CORS Errors**: Verify that `FRONTEND_URL` in your `.env` matches the origin of your web application.


## 📁 Project Structure

```markdown

backend/
├── app/
│   ├── routes/         # FastAPI Routes
│   ├── core/           # Configuration (settings, security)
│   ├── models/         # SQLModel Models
│   ├── schemas/        # Pydantic Schemas
│   ├── services/       # Business Logic
│   ├── main.py         # App Entry Point
│   ├── seed.py         # Test Data
├── requirements/
│   ├── base.txt        # Main Dependencies
│   ├── test.txt        # Test Dependencies
├── tests/              # Unit and Integration Tests
├── alembic/            # Alembic Migrations
├── alembic.ini         # Alembic Config
├── Dockerfile
├── .gitignore
├── docker-compose.yaml
├── README.md

```

## 📦 CI/CD

`.gitlab-ci.yml` file configured to:

 - Run tests
 - Apply Alembic migrations