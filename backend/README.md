# Todo App Backend API

RESTful API for task management with JWT-based authentication and user isolation.

## Features

- User registration and authentication with JWT tokens
- Secure password hashing with bcrypt
- User-isolated task management
- RESTful API design with FastAPI
- PostgreSQL database with SQLModel ORM
- Automatic API documentation with Swagger UI

## Prerequisites

- Python 3.9+
- PostgreSQL database
- pip (Python package manager)

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Edit `.env` and configure the following variables:

```env
# Database Configuration
DATABASE_URL=postgresql://user:password@host:5432/database

# Server Configuration
HOST=0.0.0.0
PORT=8000

# JWT Authentication (REQUIRED)
JWT_SECRET=your-secret-key-here-change-in-production
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=1
```

**Important**: Generate a secure random string for `JWT_SECRET` in production:

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### 3. Initialize Database

The application will automatically create database tables on startup.

### 4. Run the Server

```bash
cd backend
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

## Authentication Setup

### Registration

Register a new user account:

```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "john_doe",
    "password": "SecurePass123"
  }'
```

Password requirements:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

### Login

Authenticate and receive a JWT token:

```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123"
  }'
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "john_doe",
    "created_at": "2026-02-23T10:00:00Z"
  }
}
```

### Using Protected Endpoints

Include the JWT token in the Authorization header:

```bash
curl -X GET http://localhost:8000/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## API Documentation

Interactive API documentation is available at:

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## API Endpoints

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and receive JWT token

### Tasks (Protected)

All task endpoints require JWT authentication:

- `GET /tasks` - Get all tasks for authenticated user
- `POST /tasks` - Create a new task
- `GET /tasks/{task_id}` - Get a specific task
- `PUT /tasks/{task_id}` - Update a task
- `DELETE /tasks/{task_id}` - Delete a task
- `PATCH /tasks/{task_id}/toggle` - Toggle task completion

### Users (Protected)

- `GET /users` - Get all users (requires authentication)
- `GET /users/{user_id}` - Get a specific user (requires authentication)

## Security Features

- **Password Hashing**: Passwords are hashed using bcrypt with 12 rounds
- **JWT Tokens**: Stateless authentication with configurable expiration
- **User Isolation**: Users can only access their own tasks
- **Input Validation**: Pydantic schemas validate all inputs
- **CORS**: Configured to allow frontend domain with credentials

## Error Responses

All errors follow a consistent JSON format:

```json
{
  "detail": "Error message here"
}
```

HTTP Status Codes:
- `200` - Success
- `201` - Created
- `204` - No Content (successful deletion)
- `400` - Bad Request (validation error, duplicate data)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `422` - Unprocessable Entity (validation error)

## Development

### Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI application
│   ├── config.py            # Configuration settings
│   ├── database.py          # Database connection
│   ├── models/              # SQLModel database models
│   │   ├── user.py
│   │   └── task.py
│   ├── schemas/             # Pydantic schemas
│   │   ├── user.py
│   │   └── task.py
│   ├── routers/             # API route handlers
│   │   ├── auth.py          # Authentication endpoints
│   │   ├── users.py
│   │   └── tasks.py
│   ├── middleware/          # Authentication middleware
│   │   └── jwt_auth.py
│   └── utils/               # Utility functions
│       ├── password.py      # Password hashing
│       └── jwt_utils.py     # JWT token management
├── requirements.txt
├── .env.example
└── README.md
```

## Testing

Run the application and test authentication flow:

1. Register a new user via `/auth/register`
2. Login via `/auth/login` to receive JWT token
3. Use the token to access protected endpoints
4. Verify user isolation by creating multiple users

## Troubleshooting

### Database Connection Issues

Ensure PostgreSQL is running and the `DATABASE_URL` is correct.

### JWT Token Errors

- **"Token expired"**: Token has exceeded `JWT_EXPIRATION_HOURS`. Login again.
- **"Invalid token"**: Token is malformed or signature is invalid.
- **"Not authenticated"**: Missing Authorization header or token.

### Password Validation Errors

Ensure passwords meet all requirements (8+ chars, uppercase, lowercase, number).

## License

MIT
