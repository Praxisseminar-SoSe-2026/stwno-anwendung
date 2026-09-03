import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.security import hash_password, create_access_token
from app.db.database import Base, get_db
from app.main import app
from app.models import User


# Based on: https://sqlmodel.tiangolo.com/tutorial/fastapi/tests/#pytest-fixtures
@pytest.fixture(name="session")
def session_fixture():
    engine = create_engine(
        "sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool
    )
    Base.metadata.create_all(engine)
    session = sessionmaker(bind=engine)()
    yield session
    session.close()


@pytest.fixture(name="client")
def client_fixture(session):
    def get_session_override():
        return session

    app.dependency_overrides[get_db] = get_session_override
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()


@pytest.fixture(name="test_user")
def test_user_fixture(session):
    user = User(
        first_name="John",
        last_name="Doe",
        email="john@doe.com",
        password_hash=hash_password("password"),
        person_number="S1234",
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


@pytest.fixture(name="auth_token")
def auth_token_fixture(test_user):
    token = create_access_token(test_user.id)
    return {"Authorization": f"Bearer {token}"} # token only is not equal to the response of the endpoint