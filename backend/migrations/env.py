import os
import sys

from alembic import context
from dotenv import load_dotenv
from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool

from database.models import Base


sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

load_dotenv()

config = context.config

database_url = os.getenv(
    "DATABASE_URL",
    config.get_main_option("sqlalchemy.url")
)

database_url = database_url.replace("postgresql+asyncpg", "postgresql+psycopg2")
database_url = database_url.replace("ssl=require", "sslmode=require")
config.set_main_option("sqlalchemy.url", database_url)

# logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata 


# offline mode
def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
        compare_server_default=True,        
    )

    with context.begin_transaction():
        context.run_migrations()

# offline mode
def run_migrations_online() -> None:
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
            compare_server_default=True,            
        )

        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
