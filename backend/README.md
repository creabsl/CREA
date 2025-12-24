# CREA Backend API

Node.js + Express + MongoDB backend for the Central Railway Engineers Association portal.

## Tech Stack
- Runtime: Node.js
- Framework: Express.js
- Database: MongoDB with Mongoose
- Auth: JWT

## Setup
1. Copy `.env.example` to `.env` and set values:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
PORT=5001
```

2. Initialize project and install dependencies:

```
cd backend
npm init -y
npm install express mongoose bcryptjs jsonwebtoken cors dotenv
npm install -D nodemon
```

3. Add scripts to `package.json`:

```
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

4. Run the server:

```
npm run dev
```

## API Endpoints
- `POST /api/users/register`
- `POST /api/users/login`
- `GET /api/events`
- `POST /api/events` (protected)
- `PUT /api/events/:id` (protected)
- `DELETE /api/events/:id` (protected)

Include `Authorization: Bearer <token>` for protected routes.
