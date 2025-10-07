# GoodReaders API 📚

A comprehensive NestJS-based REST API for managing books, user reviews, and reading lists. Built with TypeScript, MongoDB, and JWT authentication.

## 🚀 Features

- **User Management**: Registration, authentication, and profile management
- **Book Management**: Create, read, update, and delete book entries with reviews
- **Reading Lists**: Track books users want to read
- **Search & Filter**: Search books by title/author and filter by genres
- **Authentication**: JWT-based secure authentication
- **Rate Limiting**: Built-in request throttling
- **Data Validation**: Comprehensive input validation with class-validator
- **MongoDB Integration**: Robust data persistence with Mongoose

## 📁 Project Structure

```
src/
├── auth/                    # Authentication module
│   ├── decorators/         # Custom decorators (@Public, @CurrentUser)
│   ├── dto/               # Data transfer objects
│   ├── guards/            # JWT authentication guard
│   ├── interfaces/        # TypeScript interfaces
│   ├── strategies/        # Passport JWT strategy
│   ├── auth.controller.ts # Auth endpoints
│   ├── auth.service.ts   # Auth business logic
│   └── auth.module.ts     # Auth module configuration
├── books/                  # Books management module
│   ├── dto/               # Book DTOs (create, update, response)
│   ├── interfaces/        # Book interfaces
│   ├── mappers/          # Response mappers
│   ├── schemas/           # MongoDB schemas
│   ├── utils/             # Utility functions
│   ├── books.controller.ts# Book endpoints
│   ├── books.service.ts   # Book business logic
│   └── books.module.ts    # Books module configuration
├── users/                  # User management module
│   ├── dto/               # User DTOs
│   ├── schemas/           # User MongoDB schema
│   ├── utils/             # User utilities
│   ├── users.controller.ts# User endpoints
│   ├── users.service.ts   # User business logic
│   └── users.module.ts    # Users module configuration
├── config/                 # Configuration files
│   ├── example.env        # Environment variables template
│   └── throttler.config.ts# Rate limiting configuration
├── app.controller.ts      # Main app controller
├── app.module.ts          # Root module
├── app.service.ts         # Main app service
└── main.ts                # Application entry point
```

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Mitronios/goodreaders-NestJS.git
   cd goodreaders-NestJS
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp src/config/example.env .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   # Database Configuration
   MONGO_HOST=localhost
   MONGO_PORT=27017
   MONGO_DB=goodreaders
   
   # Server Configuration
   PORT=3000
   NODE_ENV=development
   
   # JWT (Change this in production!)
   JWT_SECRET=your-secure-jwt-secret
   JWT_EXPIRES=2h
   
   # Throttler
   THROTTLE_TTL=60
   THROTTLE_LIMIT=5
   
   # CORS
   CORS_ORIGINS=http://localhost:5173,http://your-server-ip
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system or use Docker:
   ```bash
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

## 🚀 Running the Application

```bash
# Development mode with hot reload
npm run start:dev

# Production mode
npm run start:prod

# Build the application
npm run build
```

The API will be available at `http://localhost:3000/api/v1`

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov

# Run end-to-end tests
npm run test:e2e
```

## 📝 Code Quality

```bash
# Run linter
npm run lint

# Format code
npm run format

# Check code formatting
npm run check
```

## 📚 API Endpoints

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout

### Users
- `POST /api/v1/users` - Register new user (public)
- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/:id` - Get user by ID
- `GET /api/v1/users/search?email=...` - Search user by email
- `PATCH /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user
- `GET /api/v1/users/want-to-read/:bookId` - Get want-to-read status
- `PATCH /api/v1/users/want-to-read/:bookId` - Update want-to-read status

### Books
- `GET /api/v1/books` - Get paginated books list (public)
- `GET /api/v1/books/search?q=...` - Search books (public)
- `GET /api/v1/books/genres` - Get all available genres
- `GET /api/v1/books/:id` - Get book by ID
- `POST /api/v1/books` - Create new book
- `PATCH /api/v1/books/:id` - Update book
- `DELETE /api/v1/books/:id` - Delete book

## 🔧 Technologies Used

- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with Passport
- **Validation**: class-validator & class-transformer
- **Security**: bcrypt for password hashing, rate limiting
- **Testing**: Jest
- **Code Quality**: ESLint, Prettier

## 🐳 Docker Support

The project includes Docker configuration for easy deployment:

```bash
# Build Docker image
docker build -t goodreaders-api .

# Run with Docker Compose (if you have docker-compose.yml)
docker-compose up -d
```

## 📋 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGO_HOST` | MongoDB host | localhost |
| `MONGO_PORT` | MongoDB port | 27017 |
| `MONGO_DB` | Database name | goodreaders |
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment | development |
| `JWT_SECRET` | JWT secret key | - |
| `JWT_EXPIRES` | JWT expiration | 2h |
| `THROTTLE_TTL` | Rate limit window | 60 |
| `THROTTLE_LIMIT` | Requests per window | 5 |
| `CORS_ORIGINS` | Allowed CORS origins | - |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Repository

- **GitHub**: [https://github.com/Mitronios/goodreaders-NestJS.git](https://github.com/Mitronios/goodreaders-NestJS.git)

---

Built with ❤️ using NestJS by the GoodReaders Team.
