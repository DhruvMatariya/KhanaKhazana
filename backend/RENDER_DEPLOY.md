# Deploy Backend on Railway

This backend is configured for Railway with environment-based configuration and dynamic port binding.

## Railway-ready config already in project

- `server.port=${PORT:8080}` so Railway can bind your service port.
- `spring.data.mongodb.uri=${MONGODB_URI:}` so DB URL comes from environment variables.
- `cors.allowed-origins=${CORS_ALLOWED_ORIGINS:...}` for frontend domain allowlist.
- Public health endpoint: `GET /api/health`.

## Railway Setup (Dashboard)

1. Push latest code to GitHub.
2. In Railway, click **New Project**.
3. Choose **Deploy from GitHub repo**.
4. Select your repository.
5. Open service settings and set:
   - **Root Directory**: `backend`
   - **Builder**: Nixpacks (default)
   - **Build Command**: `./mvnw clean package -DskipTests`
   - **Start Command**: `java -jar target/backend-0.0.1-SNAPSHOT.jar`
6. Add Environment Variables in Railway:
   - `MONGODB_URI` = your MongoDB Atlas connection string
   - `GROQ_API_KEY` = your Groq API key
   - `GROQ_API_MODEL` = `llama-3.3-70b-versatile` (or your preferred model)
   - `CORS_ALLOWED_ORIGINS` = comma-separated frontend URLs, for example:
     - `https://your-frontend.up.railway.app`
     - `https://your-custom-domain.com`

## Health Check

- In Railway service settings, set health check path to: `/api/health`.

## Important Notes

- Do not keep secrets in `application.properties`.
- Keep `MONGODB_URI` and `GROQ_API_KEY` only in Railway environment variables.
- If frontend URL changes, update `CORS_ALLOWED_ORIGINS` and redeploy.
