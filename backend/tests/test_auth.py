from urllib import response


def test_login_with_correct_credentials(client, test_user):
    response = client.post("auth/login", json={"email": "john@doe.com", "password": "password"})
    assert response.status_code == 200


def test_login_with_wrong_email(client, test_user):
    response = client.post("auth/login", json={"email": "doe@john.com", "password": "password"})
    assert response.status_code == 401


def test_login_with_wrong_password(client, test_user):
    response = client.post("auth/login", json={"email": "doe@john.com", "password": "1234"})
    assert response.status_code == 401


def test_user_with_valid_token(client, test_user, auth_token):
    response = client.get("auth/me", headers=auth_token)
    assert  response.status_code == 200


def test_user_without_valid_token(client):
    response = client.get("auth/me")
    assert response.status_code == 401