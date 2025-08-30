# P5CRM Backend API Documentation

## Base Information

- **Base URL**: `http://localhost:8000` (configurable via PORT environment variable)
- **API Version**: v1
- **Base Path**: `/api/v1/users`
- **Database**: MongoDB (Database name: P5CRM)

## API Endpoints

### Authentication Endpoints

#### Login

**POST** `/api/v1/users/login`

Authenticate user and receive access token.

**Request Body:**

```javascript
{
  "email": "user@example.com",
  "password": "userPassword123",
  "role": "admin" // Required role for login
}
```

**Response (200 OK):**

```javascript
{
  "statusCode": 200,
  "data": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", // JWT token
  "message": "Login successful",
  "success": true
}
```

**Response (400 Bad Request):**

```javascript
{
  "statusCode": 400,
  "data": null,
  "message": "Email and password are required", // or "Invalid credentials" or "credentials doesn't match"
  "success": false,
  "errors": []
}
```

**Cookies Set:**

- `accessToken`: JWT token (httpOnly, secure)

---

### Admin Endpoints

All admin endpoints require authentication with `admin` role.

#### Create User

**POST** `http://localhost:8000/api/v1/users/admin/createUser`

**Authentication Required**: Yes (admin role)

Create a new user in the system.

**Request Headers:**

```
Authorization: Bearer <jwt_token>
// OR
Cookie: accessToken=<jwt_token>
```

**Request Body:**

```javascript
{
  "email": "newuser@example.com",
  "password": "SecurePassword123",
  "role": "frontend" // Single role as string
}
```

**Response (201 Created):**

```javascript
{
  "statusCode": 201,
  "data": {
    "_id": "64a7b8c9d1e2f3a4b5c6d7e8",
    "email": "newuser@example.com",
    "roles": ["frontend"],
    "createdAt": "2024-08-30T07:13:45.123Z",
    "updatedAt": "2024-08-30T07:13:45.123Z"
    // password field excluded
  },
  "message": "User created successfully",
  "success": true
}
```

**Error Responses:**

- **400 Bad Request**: Missing required fields or user already exists
- **401 Unauthorized**: Invalid or missing token
- **403 Forbidden**: Insufficient permissions

---

#### List All Users

**GET** `http://localhost:8000/api/v1/users/admin/listAllUser`

**Authentication Required**: Yes (admin role)

Retrieve all users in the system.

**Request Headers:**

```
Authorization: Bearer <jwt_token>
// OR
Cookie: accessToken=<jwt_token>
```

**Response (200 OK):**

```javascript
{
  "statusCode": 200,
  "data": [
    {
      "_id": "64a7b8c9d1e2f3a4b5c6d7e8",
      "email": "admin@gmail.com",
      "roles": ["admin"],
      "createdAt": "2024-08-30T07:13:45.123Z",
      "updatedAt": "2024-08-30T07:13:45.123Z"
    },
    {
      "_id": "64a7b8c9d1e2f3a4b5c6d7e9",
      "email": "designer@example.com",
      "roles": ["designer"],
      "createdAt": "2024-08-30T08:15:30.456Z",
      "updatedAt": "2024-08-30T08:15:30.456Z"
    }
    // ... more users (password field excluded from all)
  ],
  "message": "Fetch all users",
  "success": true
}
```

---

#### Admin Test

**GET** `http://localhost:8000/api/v1/users/admin/admintest`

**Authentication Required**: Yes (admin role)

Test endpoint to verify admin authentication.

**Response (200 OK):**

```javascript
{
  "statusCode": 200,
  "data": {
    "_id": "64a7b8c9d1e2f3a4b5c6d7e8",
    "email": "admin@gmail.com",
    "roles": ["admin"],
    "createdAt": "2024-08-30T07:13:45.123Z",
    "updatedAt": "2024-08-30T07:13:45.123Z"
  },
  "message": "Admin is logged in",
  "success": true
}
```

---

### Project Lead Endpoints

#### Project Lead Test

**GET** `http://localhost:8000/api/v1/users/pl/pltest`

**Authentication Required**: Yes (project lead role)

Test endpoint for project lead users.

**Response (200 OK):**

```javascript
{
  "statusCode": 200,
  "data": {
    "_id": "64a7b8c9d1e2f3a4b5c6d7ea",
    "email": "projectlead@example.com",
    "roles": ["project lead"],
    "createdAt": "2024-08-30T07:13:45.123Z",
    "updatedAt": "2024-08-30T07:13:45.123Z"
  },
  "message": "Accounts user is logged in", // Note: Message appears to have a typo in source
  "success": true
}
```

---

### Backend Developer Endpoints

#### Backend Test

**GET** `http://localhost:8000/api/v1/users/b/btest`

**Authentication Required**: Yes (backend role)

Test endpoint for backend developers.

**Response (200 OK):**

```javascript
{
  "statusCode": 200,
  "data": {
    "_id": "64a7b8c9d1e2f3a4b5c6d7eb",
    "email": "backend@example.com",
    "roles": ["backend"],
    "createdAt": "2024-08-30T07:13:45.123Z",
    "updatedAt": "2024-08-30T07:13:45.123Z"
  },
  "message": "backend user is logged in",
  "success": true
}
```

---

### Frontend Developer Endpoints

#### Frontend Test

**GET** `http://localhost:8000/api/v1/users/f/ftest`

**Authentication Required**: Yes (frontend role)

Test endpoint for frontend developers.

**Response (200 OK):**

```javascript
{
  "statusCode": 200,
  "data": {
    "_id": "64a7b8c9d1e2f3a4b5c6d7ec",
    "email": "frontend@example.com",
    "roles": ["frontend"],
    "createdAt": "2024-08-30T07:13:45.123Z",
    "updatedAt": "2024-08-30T07:13:45.123Z"
  },
  "message": "Accounts user is logged in", // Note: Message appears to have a typo in source
  "success": true
}
```

---

### Designer Endpoints

#### Designer Test

**GET** `http://localhost:8000/api/v1/users/d/dtest`

**Authentication Required**: Yes (designer role)

Test endpoint for designers.

**Response (200 OK):**

```javascript
{
  "statusCode": 200,
  "data": {
    "_id": "64a7b8c9d1e2f3a4b5c6d7ed",
    "email": "designer@example.com",
    "roles": ["designer"],
    "createdAt": "2024-08-30T07:13:45.123Z",
    "updatedAt": "2024-08-30T07:13:45.123Z"
  },
  "message": "Accounts user is logged in", // Note: Message appears to have a typo in source
  "success": true
}
```

---

### Accounts Endpoints

#### Accounts Test

**GET** `http://localhost:8000/api/v1/users/a/atest`

**Authentication Required**: Yes (accounts role)

Test endpoint for accounts users.

**Response (200 OK):**

```javascript
{
  "statusCode": 200,
  "data": {
    "_id": "64a7b8c9d1e2f3a4b5c6d7ee",
    "email": "accounts@example.com",
    "roles": ["accounts"],
    "createdAt": "2024-08-30T07:13:45.123Z",
    "updatedAt": "2024-08-30T07:13:45.123Z"
  },
  "message": "Accounts user is logged in",
  "success": true
}
```

---

### Default Admin Account

The system automatically creates a default admin account on startup:

- **Email**: `admin@gmail.com`
- **Password**: `Admin@123`
- **Role**: `admin`

## Development

### Running the Server

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

_This documentation is generated based on the current codebase structure and may need updates as the API evolves._
