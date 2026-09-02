from urllib import response


def test_login_with_correct_credentials(client, test_user):
    response = client.post("auth/login", json={"email": "john@doe.com", "password": "password"})
    assert response.status_code == 200