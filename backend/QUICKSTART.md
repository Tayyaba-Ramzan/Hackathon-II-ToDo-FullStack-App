# Quick Start Guide: Todo App Backend

## Prerequisites

- Python 3.9 or higher
- PostgreSQL database (Neon Serverless or local)

## Setup Steps

### 1. Navigate to Backend Directory

```bash
cd D:\phase_II_todo_fullstack_webapplication\backend
```

### 2. Create Virtual Environment

```bash
python -m venv venv
```

### 3. Activate Virtual Environment

**Windows:**
```bash
venv\Scripts\activate
```

**Linux/Mac:**
```bash
source venv/bin/activate
```

### 4. Install Dependencies

```bash
pip install -r requirements.txt
```

### 5. Configure Environment Variables

Create a `.env` file in the backend directory:

```env
DATABASE_URL=postgresql://username:password@host:5432/database_name
HOST=0.0.0.0
PORT=8000
```

**For Neon PostgreSQL:**
```env
DATABASE_URL=postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require
HOST=0.0.0.0
PORT=8000
```

### 6. Run the Application

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 7. Access API Documentation

Open your browser and navigate to:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Testing the API

### Create a User

```bash
curl -X POST "http://localhost:8000/users" \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "username": "john_doe"}'
```

### Create a Task

```bash
curl -X POST "http://localhost:8000/tasks" \
  -H "Content-Type: application/json" \
  -d '{"title": "Complete project", "description": "Finish the backend implementation", "user_id": 1}'
```

### Get All Tasks

```bash
curl -X GET "http://localhost:8000/tasks"
```

### Toggle Task Completion

```bash
curl -X PATCH "http://localhost:8000/tasks/1/toggle"
```

### Update a Task

```bash
curl -X PUT "http://localhost:8000/tasks/1" \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated title", "is_completed": true}'
```

### Delete a Task

```bash
curl -X DELETE "http://localhost:8000/tasks/1"
```

## API Endpoints Summary

### Users
- `POST /users` - Create a new user (201)
- `GET /users` - Get all users (200)
- `GET /users/{user_id}` - Get a specific user (200/404)

### Tasks
- `POST /tasks` - Create a new task (201/400/422)
- `GET /tasks` - Get all tasks (200)
- `GET /tasks/{task_id}` - Get a specific task (200/404)
- `PUT /tasks/{task_id}` - Update a task (200/404/422)
- `DELETE /tasks/{task_id}` - Delete a task (204/404)
- `PATCH /tasks/{task_id}/toggle` - Toggle completion status (200/404)

## HTTP Status Codes

- **200**: Success (GET, PUT, PATCH)
- **201**: Created (POST)
- **204**: No Content (DELETE)
- **400**: Bad Request (invalid user_id, duplicate email/username)
- **404**: Not Found (resource doesn't exist)
- **422**: Validation Error (invalid input format)
- **500**: Internal Server Error
- **503**: Service Unavailable (database connection issues)

## Troubleshooting

### Database Connection Error

If you see "Service temporarily unavailable":
1. Verify DATABASE_URL is correct in .env
2. Check database is running and accessible
3. Verify network connectivity to database host

### Import Errors

If you see module import errors:
1. Ensure virtual environment is activated
2. Reinstall dependencies: `pip install -r requirements.txt`
3. Verify you're in the backend directory

### Port Already in Use

If port 8000 is already in use:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
```

## Development Tips

- Use the interactive Swagger UI at `/docs` for easy API testing
- Check application logs for detailed error messages
- Database tables are created automatically on first startup
- All validation errors return detailed field-level messages
