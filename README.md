# Working Time Tracker

### How to run

- Create .env file in the root with:
```text
...
DB_HOST=db
...
```
- Create .env file in frontend/tracker-web with:
```text
...
REACT_APP_API_BASE_URL=http://127.0.0.1:8000
...
```
- Run the following command:
```commandline
docker compose up --build
```
Backend: http://127.0.0.1:8000

Frontend: http://127.0.0.1:3000

---
### Development

Before making any commits, run the following command to set up the pre-commit hooks:

```bash
pre-commit install
```
---

### API
#### Base API endpoints:
/api/projects/  
/api/users/  
/api/user_extensions/  
/api/tasks/  
/api/tracks/  

#### Detailed endpoints example:
| Method | URL                   | Description                               |
|--------|-----------------------|-------------------------------------------|
| GET    | /api/tracks/          | Retrieve a list of all tracks             |
| POST   | /api/tracks/          | Create a new track                        |
| GET    | /api/tracks/{id}/     | Retrieve detailed information about a track |
| PUT    | /api/tracks/{id}/     | Fully update a track                      |
| PATCH  | /api/tracks/{id}/     | Partially update a track                  |
| DELETE | /api/tracks/{id}/     | Delete a track                            |

#### Serializers:

TrackSerializer (default)  
TrackDetailedSerializer (used for retrieve)

---
### Features
- User can only be assigned to tasks from his project. This restriction is done at the model level using the clean() method.  
- When a new User object is created, a related UserExtension object is automatically created via Django signals.
