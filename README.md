# GoodReaders API

A comprehensive book management and social reading platform built with NestJS, MongoDB, and modern TypeScript practices.

## 🚀 Features

### 📚 Book Management
- **CRUD Operations**: Create, read, update, and delete books
- **Advanced Search**: Search books by title and author
- **Genre Filtering**: Filter books by genre with pagination
- **Genre Discovery**: Get all available book genres
- **Pagination**: Efficient pagination for large book collections

### 👥 User Management
- **User Registration**: Multipart form data support with avatar uploads
- **User Authentication**: JWT-based authentication system
- **Profile Management**: Update user profiles and information
- **Role-Based Access**: Support for different user roles (user, admin, moderator)
- **Want-to-Read Lists**: Users can mark books they want to read

### 🔐 Authentication & Security
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Rate Limiting**: Built-in throttling to prevent abuse
- **CORS Support**: Configurable cross-origin resource sharing
- **Input Validation**: Comprehensive request validation using class-validator

### 📁 File Upload
- **Avatar Uploads**: Support for user profile pictures
- **Multipart Form Data**: Full support for multipart/form-data requests
- **Static File Serving**: Serves uploaded files via HTTP
- **File Validation**: Proper file type and size validation

## 🏗️ Architecture

### Core Modules
- **AuthModule**: Handles authentication, JWT tokens, and user validation
- **UsersModule**: Manages user data, profiles, and want-to-read functionality
- **BooksModule**: Handles book CRUD operations, search, and filtering
- **AppModule**: Main application module with global configuration

### Key Services
- **AuthService**: User validation and JWT token generation
- **UsersService**: User management and want-to-read functionality
- **BooksService**: Book operations with genre filtering and search
- **UserMapper**: Type-safe data transformation between DTOs and entities
- **UserCreationService**: Handles multipart form data user creation

### Data Transfer Objects (DTOs)
- **LoginDto**: User login credentials
- **LoginUserDto**: Type-safe user data for login process
- **LoginResponseDto**: Structured login response with user info
- **CreateUserDto**: User registration data
- **CreateBookDto**: Book creation data
- **BookResponseDto**: Standardized book response format
- **ListBooksQueryDto**: Pagination and filtering parameters

## 🛠️ Technology Stack

- **Framework**: NestJS (Node.js)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with Passport.js
- **File Upload**: Multer for multipart form data
- **Validation**: class-validator and class-transformer
- **Security**: bcrypt for password hashing, throttling for rate limiting
- **Testing**: Jest for unit and integration tests
- **Code Quality**: ESLint, Prettier, TypeScript

## 📡 API Endpoints

### Authentication (`/api/v1/auth`)
- `POST /login` - User login with email/password
- `POST /logout` - User logout (returns success message)

### Users (`/api/v1/users`)
- `POST /` - Create new user (multipart form data with avatar)
- `GET /` - Get all users (requires authentication)
- `GET /search?email=` - Find user by email
- `GET /:id` - Get user by ID
- `PATCH /:id` - Update user information
- `DELETE /:id` - Delete user
- `GET /want-to-read/:bookId` - Get want-to-read status for a book
- `PATCH /want-to-read/:bookId` - Update want-to-read status

### Books (`/api/v1/books`)
- `POST /` - Create new book (requires authentication)
- `GET /` - Get paginated books with optional genre filtering
- `GET /search?q=` - Search books by title or author
- `GET /genres` - Get all available book genres
- `GET /:id` - Get book by ID
- `PATCH /:id` - Update book information
- `DELETE /:id` - Delete book (requires authentication)

## 🔧 Configuration

The application uses environment variables for configuration. Copy `src/config/example.env` to `src/config/.env` and configure:

```env
# Database Configuration
MONGO_HOST=localhost
MONGO_PORT=27017
MONGO_DB=goodreaders

# Server Configuration
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES=2h

# Throttler
THROTTLE_TTL=60
THROTTLE_LIMIT=5

# CORS
CORS_ORIGINS=http://localhost:5173,http://your-server-ip
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v5 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd goodreaders
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp src/config/example.env src/config/.env
   # Edit the .env file with your configuration
   ```

4. **Start MongoDB**
   ```bash
   # Make sure MongoDB is running on your system
   mongod
   ```

5. **Run the application**
   ```bash
   # Development mode
   npm run start:dev
   
   # Production mode
   npm run build
   npm run start:prod
   ```

The API will be available at `http://localhost:3000/api/v1`

## 🧪 Testing

### Run Tests
```bash
# Unit tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

### Test Coverage
The application includes comprehensive test coverage for:
- All service methods
- Controller endpoints
- Authentication flows
- Data validation
- Error handling

## 📁 Project Structure

```
src/
├── auth/                 # Authentication module
│   ├── dto/             # Data transfer objects
│   ├── guards/          # JWT authentication guards
│   ├── interfaces/      # TypeScript interfaces
│   ├── mappers/         # Data transformation services
│   ├── strategies/      # Passport strategies
│   └── decorators/      # Custom decorators
├── books/               # Books module
│   ├── dto/             # Book-related DTOs
│   ├── interfaces/      # Book interfaces
│   ├── mappers/         # Book data mappers
│   ├── schemas/         # MongoDB schemas
│   └── utils/           # Utility functions
├── users/               # Users module
│   ├── dto/             # User DTOs
│   ├── interfaces/      # User interfaces
│   ├── schemas/         # User MongoDB schemas
│   ├── services/        # User-related services
│   └── utils/           # User utilities
├── config/              # Configuration files
├── main.ts              # Application entry point
└── app.module.ts        # Root module
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: Prevents API abuse with configurable limits
- **Input Validation**: Comprehensive request validation
- **CORS Protection**: Configurable cross-origin policies
- **Type Safety**: Full TypeScript implementation

## 📊 Performance Features

- **Pagination**: Efficient data pagination for large datasets
- **Database Indexing**: Optimized MongoDB queries
- **Static File Serving**: Efficient file serving for uploads
- **Request Throttling**: Prevents server overload
- **Connection Pooling**: MongoDB connection optimization

## 🎯 Recent Improvements

### Type Safety Refactoring
- Implemented proper DTOs for all API endpoints
- Created UserMapper service for safe data transformations
- Eliminated unsafe type assertions and manual object destructuring
- Added comprehensive TypeScript interfaces

### Multipart Form Data Support
- Full support for multipart/form-data requests
- Avatar upload functionality with file validation
- Proper handling of form data and file uploads
- Static file serving for uploaded content

### Enhanced Authentication
- Improved JWT token handling
- Better user validation flow
- Enhanced login response with user information
- Type-safe authentication throughout the application

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the UNLICENSED License.

## 🆘 Support

For support and questions, please open an issue in the repository or contact the development team.

---

**GoodReaders API** - Empowering readers to discover, manage, and share their favorite books! 📚✨