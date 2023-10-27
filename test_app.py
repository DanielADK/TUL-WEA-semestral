import json
import pytest
from app import app, db, Task, User


task_id = None

@pytest.fixture(scope="module")
def login_token():
    from app import app
    with app.test_client() as client:
        mock_data = {"username": "daniel", "password": "adamek"}
        response = client.post("/login", json=mock_data)
        assert response.status_code == 200
        return response.json["token"]


def test_login_failed() -> None:
    with app.test_client() as client:
        mock_data = {"username": "test", "password": "test"}
        response = client.post("/login", json=mock_data)
        assert response.status_code == 401
        assert response.json["success"] is False


def test_login_success() -> None:
    with app.test_client() as client:
        mock_data = {"username": "daniel", "password": "adamek"}
        response = client.post("/login", json=mock_data)
        assert response.status_code == 200
        assert response.json["success"] is True
        assert response.json["token"] is not None
        assert response.json["username"] == "daniel"
        assert response.json["userId"] == 1


def test_create_task(login_token: str) -> None:
    global task_id
    with app.test_client() as client:
        mock_token = f'Bearer {login_token}'
        mock_data = {'description': 'Test Task'}
        response = client.post('/tasks', json=mock_data, headers={'Authorization': mock_token})
        assert response.status_code == 200
        task_id = response.json["id"]



def test_get_tasks(login_token: str) -> None:
    with app.test_client() as client:
        mock_token = f'Bearer {login_token}'
        response = client.get('/tasks', headers={'Authorization': mock_token})
        assert response.status_code == 200


def test_update_task(login_token: str) -> None:
    assert task_id is not None
    with app.test_client() as client:
        mock_token = f'Bearer {login_token}'
        mock_data = {'description': 'Updated Task'}
        # Předpokládáme, že task s ID 1 existuje
        response = client.put(f'/tasks/{task_id}', json=mock_data, headers={'Authorization': mock_token})
        assert response.status_code == 200


def test_toggle_completion(login_token : str) -> None:
    assert task_id is not None
    with app.test_client() as client:
        mock_token = f'Bearer {login_token}'
        # Předpokládáme, že task s ID 1 existuje
        response = client.put(f'/tasks/{task_id}', json={'completed': True}, headers={'Authorization': mock_token})
        assert response.status_code == 200


def test_delete_task(login_token: str) -> None:
    assert task_id is not None
    with app.test_client() as client:
        mock_token = f'Bearer {login_token}'
        #
        response = client.delete(f'/tasks/{task_id}', headers={'Authorization': mock_token})
        assert response.status_code == 200
