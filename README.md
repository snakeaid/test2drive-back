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
5. **Test protected endpoints** like `/users/me` or lecture management

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

### Lectures & Categories
- `GET /lectures/categories` - Get all lecture categories
- `GET /lectures/categories/:id` - Get category by ID
- `POST /lectures/categories` - Create category (🔒 Auth required)
- `PUT /lectures/categories/:id` - Update category (🔒 Auth required)
- `DELETE /lectures/categories/:id` - Delete category (🔒 Auth required)
- `GET /lectures` - Get all published lectures
- `GET /lectures/:id` - Get lecture by ID
- `POST /lectures` - Create lecture (🔒 Auth required)
- `PUT /lectures/:id` - Update lecture (🔒 Auth required)
- `DELETE /lectures/:id` - Delete lecture (🔒 Auth required)
- `POST /lectures/:id/complete` - Mark lecture as completed (🔒 Auth required)
- `GET /lectures/progress/me` - Get user's lecture progress (🔒 Auth required)

### Questions & Answer Submission
- `GET /questions/categories` - Get all question categories
- `GET /questions/categories/:id` - Get category by ID
- `POST /questions/categories` - Create category (🔒 Auth required)
- `PUT /questions/categories/:id` - Update category (🔒 Auth required)
- `DELETE /questions/categories/:id` - Delete category (🔒 Auth required)
- `GET /questions` - Get all published questions
- `GET /questions/:id` - Get question by ID
- `POST /questions` - Create question (🔒 Auth required)
- `PUT /questions/:id` - Update question (🔒 Auth required)
- `DELETE /questions/:id` - Delete question (🔒 Auth required)
- `POST /questions/:id/answer` - Submit answer (🔒 Auth required)
- `GET /questions/attempts/me` - Get user's question attempts (🔒 Auth required)

### Tests (Practice, Thematic, Exam)
- `GET /tests` - Get all published tests
- `GET /tests/type/:type` - Get tests by type (practice/thematic/exam)
- `GET /tests/:id` - Get test by ID
- `POST /tests` - Create test (🔒 Auth required)
- `PATCH /tests/:id` - Update test (🔒 Auth required)
- `DELETE /tests/:id` - Delete test (🔒 Auth required)
- `POST /tests/:id/start` - Start test session (🔒 Auth required)
- `GET /tests/:id/session` - Get active session (🔒 Auth required)
- `GET /tests/:id/current-question` - Get current question (🔒 Auth required)
- `POST /tests/:id/answer` - Submit answer (🔒 Auth required)
- `POST /tests/sessions/:sessionId/complete` - Complete test (🔒 Auth required)
- `GET /tests/results/me` - Get user's test results (🔒 Auth required)
- `GET /tests/:id/results` - Get test results (🔒 Auth required)
- `GET /tests/results/:id` - Get detailed result (🔒 Auth required)

### Exams (Official Exam System)
- `GET /exams` - Get all published exams
- `GET /exams/:id` - Get exam by ID
- `POST /exams` - Create exam (🔒 Auth required)
- `PATCH /exams/:id` - Update exam (🔒 Auth required)
- `DELETE /exams/:id` - Delete exam (🔒 Auth required)
- `POST /exams/:id/start` - Start exam session (🔒 Auth required)
- `GET /exams/:id/session` - Get active exam session (🔒 Auth required)
- `GET /exams/:id/current-question` - Get current exam question (🔒 Auth required)
- `POST /exams/:id/answer` - Submit exam answer (🔒 Auth required)
- `POST /exams/sessions/:sessionId/complete` - Complete exam (🔒 Auth required)
- `GET /exams/results/me` - Get user's exam results (🔒 Auth required)
- `GET /exams/:id/results` - Get exam results (🔒 Auth required)
- `GET /exams/results/:id` - Get detailed exam result (🔒 Auth required)
- `GET /exams/:id/statistics` - Get exam statistics (🔒 Auth required)

## Database Schema

### Users & Authentication
- **users**: User accounts with email/password
- **user_profiles**: Extended user information (phone, birth date, avatar)

### Lectures System
- **lecture_categories**: Lecture organization (e.g., "Дорожні знаки", "ПДД")
- **lectures**: Educational content with HTML support
- **lecture_progress**: User completion tracking

### Questions System
- **question_categories**: Question organization (linked to lectures)
- **questions**: Multiple choice questions with difficulty levels
- **question_options**: Answer choices (A, B, C, D) with text/image support
- **question_attempts**: User answer history with feedback

### Tests & Exams System
- **tests**: Test configurations (practice/thematic/exam types)
- **test_questions**: Question-test relationships with ordering/points
- **test_sessions**: Active test sessions with timing and progress
- **test_session_answers**: Individual question answers within sessions
- **test_results**: Final scores and pass/fail results

## Key Features

### 🎓 Learning Management
- **Structured Content**: Organized lecture categories and chapters
- **Progress Tracking**: Individual user progress through materials
- **Rich Content**: HTML support for text, images, and multimedia

### 📝 Question System
- **Multiple Choice**: A, B, C, D options with single correct answer
- **Flexible Content**: Text and image/GIF support in both questions and options
- **Difficulty Levels**: Easy, medium, hard classification
- **Immediate Feedback**: Instant correctness with explanations

### 🧪 Testing Framework
- **Multiple Test Types**:
  - **Practice**: Unlimited retries, immediate feedback
  - **Thematic**: Category-specific testing
  - **Exam**: Official tests with strict rules
- **Session Management**: Progressive answering, time limits, auto-expiration
- **Comprehensive Scoring**: Points, percentages, pass/fail determination

### 🏆 Exam System (Built on Tests)
- **Official Standards**: 10-40 questions, required time limits
- **Strict Validation**: Higher passing scores (75% default)
- **Limited Retries**: Optional retry prevention
- **Delayed Results**: Results shown after completion
- **Statistical Analysis**: Pass rates, average scores, timing analytics

### 🔒 Security Features
- **JWT Authentication**: Secure token-based authentication
- **Role-based Access**: Public browsing, protected management
- **Input Validation**: Comprehensive data validation with class-validator
- **Session Security**: Collision prevention, expiration handling

### 📊 Analytics & Reporting
- **Individual Progress**: Personal completion and attempt history
- **Test Analytics**: Detailed question-by-question breakdowns
- **Exam Statistics**: Institution-level pass rates and performance metrics
- **Time Tracking**: Precise timing for questions and sessions

## Ukrainian Language Support

The system is designed for Ukrainian driving theory learning with:
- Ukrainian interface text and examples
- Support for Ukrainian traffic signs and regulations
- Localized content management
- Cultural and regional specificity

## Additional Dependencies Added

- **@nestjs/swagger**: OpenAPI/Swagger documentation
- **swagger-ui-express**: Swagger UI interface
- **@types/swagger-ui-express**: TypeScript types for Swagger UI
