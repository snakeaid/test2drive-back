# Test2Drive Setup Instructions

## Environment Configuration

Create the following environment file in the `env/` directory:

### `env/.env.development/production`
```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=test2drive

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Application
NODE_ENV=development
PORT=3000
```

## Database Setup

1. Install PostgreSQL
2. Create database:
```sql
CREATE DATABASE test2drive;
```

3. The application will automatically create tables on first run (synchronize: true in development)

## Redis Setup

1. Install Redis
2. Start Redis server:
```bash
redis-server
```

## Running the Application

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run start:dev
```

## API Documentation (Swagger)

After starting the application, you can access the interactive API documentation at:

**🚀 Swagger UI: http://localhost:5001/api-docs**

### Features:
- ✅ **Interactive Testing**: Test all endpoints directly from the browser
- ✅ **JWT Authentication**: Click "Authorize" button to add Bearer token
- ✅ **Request/Response Examples**: See exactly what data to send and expect
- ✅ **Validation Info**: View all validation rules and constraints
- ✅ **Schema Documentation**: Detailed data model descriptions

### How to Use Swagger:
1. **Register a user** via `POST /auth/register`
2. **Login** via `POST /auth/login` to get JWT tokens
3. **Click "Authorize"** button in Swagger UI
4. **Enter token** as: `Bearer your-access-token-here`
5. **Test protected endpoints** like `/users/me` or `/auth/profile`

## API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh access token
- `GET /auth/profile` - Get current user profile

### Users
- `GET /users/me` - Get current user details
- `GET /users/:id` - Get user by ID
- `PUT /users/me/profile` - Update user profile

## Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `email` (VARCHAR, Unique)
- `password_hash` (VARCHAR)
- `first_name` (VARCHAR, Nullable)
- `last_name` (VARCHAR, Nullable)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### User Profiles Table
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `phone` (VARCHAR, Nullable)
- `date_of_birth` (DATE, Nullable)
- `avatar_url` (VARCHAR, Nullable)

## Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Global JWT guard with public endpoint exceptions
- Input validation with class-validator
- CORS protection

## Additional Dependencies Added

- **@nestjs/swagger**: OpenAPI/Swagger documentation
- **swagger-ui-express**: Swagger UI interface
- **@types/swagger-ui-express**: TypeScript types for Swagger UI 
