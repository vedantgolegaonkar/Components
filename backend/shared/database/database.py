import os
from dotenv import load_dotenv
from sqlalchemy.orm import scoped_session, sessionmaker

from shared.database.base import Base

from sqlalchemy import text
from sqlalchemy import create_engine
from sqlalchemy.engine import Engine
from sqlalchemy.engine.url import URL
from sqlalchemy.exc import SQLAlchemyError

# from shared.database.database import SessionLocal
from shared.database.users.user_schema import User

# Load environment variables
load_dotenv()

def load_config_from_env():
    return {
      "drivername": "postgresql+psycopg2",
        "username": os.getenv("DATABASE_USER"),
        "password": os.getenv("DATABASE_PASSWORD"),
        "host": os.getenv("DATABASE_HOST"),
        "port": os.getenv("DATABASE_PORT"),
        "database": os.getenv("DATABASE_NAME"),
        "pool_size": int(os.getenv("DB_POOL_SIZE", 5)),
        "max_overflow": int(os.getenv("DB_MAX_OVERFLOW", 10)),
        "pool_timeout": int(os.getenv("DB_POOL_TIMEOUT", 30)),
        "pool_recycle": int(os.getenv("DB_POOL_RECYCLE", 1800)),
        "echo": os.getenv("DB_ECHO", "false").lower() == "true"
    }

# Initialize database engine
_engine: Engine | None = None

def get_database_url(drivername, username, password, host, port, database) -> URL:
    db_config = {
        "drivername": drivername,
        "username": username,
        "password": password,
        "host": host,
        "port": port,
        "database": database,
    }

    if not all(db_config.values()):
        missing = [k for k, v in db_config.items() if not v]
        raise ValueError(f"Missing database configuration values: {', '.join(missing)}")

    return URL.create(**db_config)

def get_engine(
    drivername,
    username,
    password,
    host,
    port,
    database,
    pool_size=5,
    max_overflow=10,
    pool_timeout=30,
    pool_recycle=1800,
    echo=False
) -> Engine:
    global _engine
    if _engine is None:
        try:
            db_url = get_database_url(drivername, username, password, host, port, database)
            _engine = create_engine(
                db_url,
                pool_size=pool_size,
                max_overflow=max_overflow,
                pool_timeout=pool_timeout,
                pool_recycle=pool_recycle,
                echo=echo
            )
            # print("Database engine created successfully with pooled settings.")
        except SQLAlchemyError as e:
            raise RuntimeError(f"Failed to create SQLAlchemy engine: {e}")
    return _engine

#####################################################################################################################

# ------------------------
# Complete the init_database function to auto generate the schema during application launch ######
# ------------------------

# def init_database(engine):
#     inspector = inspect(engine)
#     existing_tables = inspector.get_table_names()
#     print(existing_tables)
#

####################################################################################################################

# ------------------------
# Initialize database engine
# ------------------------

_engine: Engine | None = None

config = load_config_from_env()
engine = get_engine(
        config["drivername"],
        config["username"],
        config["password"],
        config["host"],
        config["port"],
        config["database"],
        pool_size=config["pool_size"],
        max_overflow=config["max_overflow"],
        pool_timeout=config["pool_timeout"],
        pool_recycle=config["pool_recycle"],
        echo=config["echo"]
        )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Session = scoped_session(SessionLocal)

