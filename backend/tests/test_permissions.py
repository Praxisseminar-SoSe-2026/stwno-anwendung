from urllib import response


def test_resident_cannot_list_users(client, auth_token):
    response = client.get("/users", headers=auth_token)
    assert response.status_code == 403


def test_admin_can_list_users(client, admin_token):
    response = client.get("/users", headers=admin_token)
    assert response.status_code == 200


def test_resident_cannot_post_announcement(client, auth_token):
    response = client.post(
        "/announcements", json={"title": "Bla", "text": "Blablabla"}, headers=auth_token
    )
    assert response.status_code == 403


def test_admin_can_post_announcement(client, admin_token):
    response = client.post(
        "/announcements",
        json={"title": "Bla", "text": "Blablabla"},
        headers=admin_token,
    )
    assert response.status_code == 201


def test_resident_cannot_create_dormitory(client, auth_token):
    response = client.post(
        "/dormitories",
        json={
            "name": "Haus",
            "address": "Musterstraße 1",
            "city": "Regensburg",
            "zip_code": "93053",
        },
        headers=auth_token,
    )
    assert response.status_code == 403


def test_admin_can_create_dormitory(client, admin_token):
    response = client.post(
        "/dormitories",
        json={
            "name": "Haus",
            "address": "Musterstraße 1",
            "city": "Regensburg",
            "zip_code": "93053",
        },
        headers=admin_token,
    )
    assert response.status_code == 200
