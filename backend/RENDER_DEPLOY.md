# Deploy Backend on Render

This backend is now configured for Render with environment-based configuration and dynamic port binding.

## What was added for Render

- `server.port=${PORT:8080}` so Render can bind your service port.
- `spring.data.mongodb.uri=${MONGODB_URI:}` so database URL is supplied from Render environment variables.
- `cors.allowed-origins=${CORS_ALLOWED_ORIGINS:...}` and security wiring for production frontend domains.
- Public health endpoint: `GET /api/health`.

## Render Setup (Dashboard)

1. Push your latest code to GitHub.
2. In Render, click **New +** -> **Web Service**.
3. Connect your repository.
4. Set these options:
   - **Root Directory**: `backend`
   - **Environment**: `Java`
   - **Region**: choose closest to your users
   - **Branch**: your deploy branch (for example `main`)
   - **Build Command**: `./mvnw clean package -DskipTests`
   - **Start Command**: `java -jar target/backend-0.0.1-SNAPSHOT.jar`
   - **Plan**: Free (or paid for better uptime)
5. Add Environment Variables in Render:
   - `MONGODB_URI` = your MongoDB Atlas connection string
   - `GROQ_API_KEY` = your Groq API key
   - `GROQ_API_MODEL` = `llama-3.3-70b-versatile` (or your preferred model)
   - `CORS_ALLOWED_ORIGINS` = comma-separated frontend URLs, for example:
     - `https://your-frontend.onrender.com`
     - `https://your-custom-domain.com`

## Health Check

- In Render advanced settings, set Health Check Path to: `/api/health`

## Important Notes

- Do not keep secrets in `application.properties`.
- Keep `MONGODB_URI` and `GROQ_API_KEY` only in Render environment variables.
- If your frontend is deployed later and URL changes, update `CORS_ALLOWED_ORIGINS`.
