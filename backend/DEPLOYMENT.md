# Hugging Face Spaces Deployment Guide

## 📋 Prerequisites

- Hugging Face account
- PostgreSQL database (e.g., Neon, Supabase, or Railway)
- Git installed locally

## 🚀 Deployment Steps

### 1. Prepare Your Database

Get a PostgreSQL connection string from your provider:
```
postgresql://user:password@host:port/database
```

### 2. Create Hugging Face Space

1. Go to https://huggingface.co/spaces
2. Click "Create new Space"
3. Choose:
   - **SDK**: Docker
   - **Space name**: your-todo-app
   - **Visibility**: Public or Private

### 3. Configure Environment Variables

In your Hugging Face Space settings, add these secrets:

```
DATABASE_URL=postgresql://user:password@host:port/database
SECRET_KEY=your-super-secret-jwt-key-min-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

**Important**: Never commit these values to your repository!

### 4. Push to Hugging Face

```bash
# Clone your Hugging Face Space repository
git clone https://huggingface.co/spaces/YOUR_USERNAME/your-todo-app
cd your-todo-app

# Copy backend files
cp -r /path/to/your/backend/* .

# Commit and push
git add .
git commit -m "Initial deployment"
git push
```

### 5. Monitor Deployment

- Go to your Space page
- Check the "Logs" tab for build progress
- Wait for "Running" status

## 🧪 Local Testing Before Deployment

### Test with Docker locally:

```bash
# Build the image
docker build -t todo-backend .

# Run with environment variables
docker run -p 7860:7860 \
  -e DATABASE_URL="postgresql://user:password@host:port/database" \
  -e SECRET_KEY="your-secret-key" \
  -e ALGORITHM="HS256" \
  -e ACCESS_TOKEN_EXPIRE_MINUTES="30" \
  todo-backend

# Test the API
curl http://localhost:7860
curl http://localhost:7860/docs
```

### Test without Docker:

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file (see .env.example)
cp .env.example .env
# Edit .env with your values

# Run the server
uvicorn app.main:app --host 0.0.0.0 --port 7860 --reload

# Test
curl http://localhost:7860
```

## 📁 Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py          # FastAPI app instance
│   ├── config.py        # Settings
│   ├── database.py      # Database connection
│   ├── models/          # SQLModel models
│   ├── routers/         # API endpoints
│   ├── schemas/         # Pydantic schemas
│   └── utils/           # Helper functions
├── Dockerfile           # Docker configuration
├── .dockerignore        # Files to exclude from Docker
├── requirements.txt     # Python dependencies
├── .env.example         # Example environment variables
└── README.md           # This file
```

## 🔧 Troubleshooting

### ModuleNotFoundError: No module named 'psycopg2'
✅ **Fixed**: Using `psycopg2-binary==2.9.9` in requirements.txt

### Port Issues
- Hugging Face Spaces requires port **7860**
- Make sure your Dockerfile exposes this port
- CMD must use `--port 7860`

### Database Connection Errors
- Verify DATABASE_URL format: `postgresql://user:password@host:port/database`
- Check if your database allows external connections
- Ensure IP whitelist includes Hugging Face IPs (or allow all)

### Build Failures
- Check Logs tab in Hugging Face Space
- Verify all dependencies are in requirements.txt
- Ensure Dockerfile syntax is correct

## 🔐 Security Notes

1. **Never commit secrets** to Git
2. Use Hugging Face Spaces **Secrets** for sensitive data
3. Keep `SECRET_KEY` strong (min 32 characters)
4. Use environment variables for all configuration

## 📚 API Documentation

Once deployed, access:
- **API Docs**: `https://YOUR_USERNAME-your-todo-app.hf.space/docs`
- **Root**: `https://YOUR_USERNAME-your-todo-app.hf.space/`

## 🆘 Support

- Hugging Face Docs: https://huggingface.co/docs/hub/spaces-sdks-docker
- FastAPI Docs: https://fastapi.tiangolo.com/
- Issues: Check logs in Hugging Face Space settings
