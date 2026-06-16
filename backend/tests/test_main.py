from fastapi.testclient import TestClient

from python_rurrning.main import app

client = TestClient(app)


def test_hello_default():
    res = client.get("/api/hello")
    assert res.status_code == 200
    assert res.json() == {"message": "Hello, World!"}


def test_hello_name():
    res = client.get("/api/hello", params={"name": "React"})
    assert res.status_code == 200
    assert res.json() == {"message": "Hello, React!"}
