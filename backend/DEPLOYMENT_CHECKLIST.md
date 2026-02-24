# Hugging Face Deployment Checklist

## Pre-Deployment Verification

### 1. Verify Dependencies Locally
```bash
cd backend
python verify_dependencies.py
```

Expected output: `[SUCCESS] All checks passed! Ready for deployment.`

### 2. Test Application Locally
```bash
# Create .env file
cp .env.example .env
# Edit .env with your database credentials

# Run the application
uvicorn app.main:app --host 0.0.0.0 --port 7860 --reload

# Test endpoints
curl http://localhost:7860
curl http://localhost:7860/docs
```

### 3. Test with Docker (Optional)
```bash
# Build image
docker build -t todo-backend .

# Run container
docker run -p 7860:7860 \
  -e DATABASE_URL="postgresql://user:pass@host:5432/db" \
  -e JWT_SECRET="your-secret-key" \
  -e JWT_ALGORITHM="HS256" \
  -e JWT_EXPIRATION_HOURS="24" \
  todo-backend

# Test
curl http://localhost:7860
```

## Deployment Steps

### Step 1: Prepare Database
- [ ] Create PostgreSQL database (Neon, Supabase, Railway, etc.)
- [ ] Get connection string: `postgresql://user:password@host:5432/database`
- [ ] Test connection from local machine
- [ ] Whitelist Hugging Face IPs (or allow all connections)

### Step 2: Create Hugging Face Space
- [ ] Go to https://huggingface.co/spaces
- [ ] Click "Create new Space"
- [ ] Choose SDK: **Docker**
- [ ] Set visibility (Public/Private)
- [ ] Create space

### Step 3: Configure Environment Variables
In your Space settings, add these secrets:

```
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET=your-super-secret-key-min-32-characters
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24
```

**IMPORTANT**: Never commit these to Git!

### Step 4: Deploy Code
```bash
# Clone your Hugging Face Space
git clone https://huggingface.co/spaces/YOUR_USERNAME/your-space-name
cd your-space-name

# Copy backend files
cp -r /path/to/backend/* .

# Verify files are present
ls -la
# Should see: Dockerfile, requirements.txt, app/, etc.

# Commit and push
git add .
git commit -m "Initial deployment"
git push
```

### Step 5: Monitor Deployment
- [ ] Go to your Space page on Hugging Face
- [ ] Click "Logs" tab
- [ ] Watch build progress
- [ ] Wait for "Running" status (may take 5-10 minutes)

### Step 6: Test Deployed Application
```bash
# Replace with your actual Space URL
curl https://YOUR_USERNAME-your-space-name.hf.space/
curl https://YOUR_USERNAME-your-space-name.hf.space/docs
```

## Common Issues & Solutions

### Issue: ModuleNotFoundError: No module named 'psycopg2'
**Solution**: ✅ Fixed - Using `psycopg2-binary==2.9.9` in requirements.txt

### Issue: ImportError: email-validator is not installed
**Solution**: ✅ Fixed - Added `email-validator==2.1.0` to requirements.txt

### Issue: Port binding error
**Solution**: Ensure Dockerfile uses port 7860 (Hugging Face requirement)

### Issue: Database connection timeout
**Solutions**:
- Verify DATABASE_URL format
- Check database allows external connections
- Verify IP whitelist includes Hugging Face
- Test connection from another external service

### Issue: Build fails with "No space left on device"
**Solution**: Optimize Dockerfile (already optimized with multi-stage build)

### Issue: Application crashes on startup
**Solutions**:
- Check logs in Hugging Face Space
- Verify all environment variables are set
- Test locally with same environment variables

## Files Checklist

Ensure these files are in your repository:

- [x] `Dockerfile` - Docker configuration for Hugging Face
- [x] `requirements.txt` - All Python dependencies (including email-validator)
- [x] `.dockerignore` - Files to exclude from Docker build
- [x] `.env.example` - Example environment variables
- [x] `app/` - Application code directory
- [x] `app/main.py` - FastAPI application entry point
- [x] `DEPLOYMENT.md` - Detailed deployment guide
- [x] `verify_dependencies.py` - Dependency verification script

## Security Checklist

- [ ] Never commit `.env` file to Git
- [ ] Use strong JWT_SECRET (min 32 characters)
- [ ] Use Hugging Face Secrets for sensitive data
- [ ] Enable HTTPS (automatic on Hugging Face)
- [ ] Review CORS settings in production
- [ ] Use environment variables for all configuration

## Post-Deployment

### Test All Endpoints
- [ ] GET `/` - Root endpoint
- [ ] GET `/docs` - API documentation
- [ ] POST `/auth/register` - User registration
- [ ] POST `/auth/login` - User login
- [ ] GET `/users/me` - Get current user
- [ ] POST `/tasks` - Create task
- [ ] GET `/tasks` - List tasks

### Monitor Performance
- [ ] Check response times
- [ ] Monitor error rates in logs
- [ ] Verify database connections are stable
- [ ] Test under load (if needed)

## Quick Reference

### Your Space URL
```
https://YOUR_USERNAME-your-space-name.hf.space
```

### API Documentation
```
https://YOUR_USERNAME-your-space-name.hf.space/docs
```

### View Logs
```
Hugging Face Space → Settings → Logs
```

### Update Deployment
```bash
# Make changes to code
git add .
git commit -m "Update: description"
git push
# Hugging Face will automatically rebuild
```

## Support Resources

- Hugging Face Spaces Docs: https://huggingface.co/docs/hub/spaces
- FastAPI Documentation: https://fastapi.tiangolo.com/
- SQLModel Documentation: https://sqlmodel.tiangolo.com/
- Pydantic Documentation: https://docs.pydantic.dev/

## Success Criteria

Your deployment is successful when:
- ✅ Space shows "Running" status
- ✅ Root endpoint returns JSON response
- ✅ `/docs` shows interactive API documentation
- ✅ Can register new user
- ✅ Can login and receive JWT token
- ✅ Can create and retrieve tasks
- ✅ No errors in logs

---

**Ready to deploy?** Run `python verify_dependencies.py` first!
