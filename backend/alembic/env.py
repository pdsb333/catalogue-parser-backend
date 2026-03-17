from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool, text
from alembic import context
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from sqlmodel import SQLModel
from app.models import *  # noqa: F401 - importe tous les modèles

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = SQLModel.metadata

# ✅ Injecte DATABASE_URL depuis l'environnement (écrase alembic.ini)
DATABASE_URL = os.environ.get("DATABASE_URL")
if DATABASE_URL:
    # Neon exige sslmode=require
    if "sslmode" not in DATABASE_URL:
        DATABASE_URL += "?sslmode=require"
    config.set_main_option("sqlalchemy.url", DATABASE_URL)


def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    # En prod (Neon), on crée un engine dédié aux migrations
    # pour garantir NullPool (pas de connexions persistantes)
    db_url = config.get_main_option("sqlalchemy.url")
    
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
        url=db_url,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
        )
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()