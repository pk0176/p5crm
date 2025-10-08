# P5CRM Backend API Documentation

## Overview

P5CRM Backend is a role-based CRM system built with Node.js, Express.js, and MongoDB. The API supports multiple user roles including admin, project lead, backend developer, frontend developer, designer, and accounts manager.

## Base URL

```
http://localhost:8000/api/v1
```

## Authentication

The API uses JWT (JSON Web Token) for authentication. After successful login, a token is provided that must be included in subsequent requests.

### Authentication Methods

1. **Cookie-based**: Token is automatically stored in `accessToken` cookie
2. **Header-based**: Include token in Authorization header: `Bearer <token>`

### Supported Roles

- `admin`
- `project lead`
- `backend`
- `frontend`
- `designer`
- `accounts`
- `user`

---

## Endpoints

### Authentication

#### POST /users/login

Authenticate a user and receive an access token.

**Request Body:**

```json
{
    "email": "user@example.com",
    "password": "password123",
    "role": "admin"
}
```

**Response (Success - 200):**

```json
{
    "statusCode": 200,
    "data": "jwt_access_token_here",
    "message": "Login successful",
    "success": true
}
```

---

### Admin Endpoints

_All admin endpoints require authentication with `admin` role._

#### POST /users/admin/createStaff

Create a new staff member.

**Headers:**

```
Authorization: Bearer <admin_token>
```

**Request Body:**

```json
{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "password123",
    "role": "backend",
    "internId": "INT001",
    "employeeType": "intern",
    "status": "active"
}
```

**Response (Success - 201):**

```json
{
    "statusCode": 201,
    "data": {
        "user": {
            "_id": "user_id",
            "email": "john.doe@example.com",
            "roles": ["backend"],
            "createdAt": "2023-01-01T00:00:00.000Z",
            "updatedAt": "2023-01-01T00:00:00.000Z"
        },
        "staff": {
            "_id": "staff_id",
            "name": "John Doe",
            "internId": "INT001",
            "employeeType": "intern",
            "status": "active",
            "user": "user_id",
            "createdAt": "2023-01-01T00:00:00.000Z",
            "updatedAt": "2023-01-01T00:00:00.000Z"
        }
    },
    "message": "Staff created successfully",
    "success": true
}
```

#### GET /users/admin/listAllStaff

Get a list of all staff members.

**Headers:**

```
Authorization: Bearer <admin_token>
```

**Response (Success - 200):**

```json
{
    "statusCode": 200,
    "data": [
        {
            "_id": "staff_id",
            "name": "John Doe",
            "internId": "INT001",
            "employeeType": "intern",
            "status": "active",
            "user": {
                "_id": "user_id",
                "email": "john.doe@example.com",
                "roles": ["backend"],
                "createdAt": "2023-01-01T00:00:00.000Z",
                "updatedAt": "2023-01-01T00:00:00.000Z"
            },
            "createdAt": "2023-01-01T00:00:00.000Z",
            "updatedAt": "2023-01-01T00:00:00.000Z"
        }
    ],
    "message": "Fetched all staff",
    "success": true
}
```

#### PATCH /users/admin/updateStaff/:staffId

Update an existing staff member.

**Headers:**

```
Authorization: Bearer <admin_token>
```

**Parameters:**

- `staffId` (string): The ID of the staff member to update

**Request Body:**

```json
{
    "name": "John Smith",
    "email": "john.smith@example.com",
    "role": "frontend",
    "internId": "INT002",
    "employeeType": "full-time",
    "status": "active"
}
```

**Response (Success - 200):**

```json
{
    "statusCode": 200,
    "data": {
        "_id": "staff_id",
        "name": "John Smith",
        "internId": "INT002",
        "employeeType": "full-time",
        "status": "active",
        "user": {
            "_id": "user_id",
            "email": "john.smith@example.com",
            "roles": ["frontend"],
            "createdAt": "2023-01-01T00:00:00.000Z",
            "updatedAt": "2023-01-01T00:00:00.000Z"
        },
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z"
    },
    "message": "Staff updated successfully",
    "success": true
}
```

#### PATCH /users/admin/change-password/:userId

Change password for any user.

**Headers:**

```
Authorization: Bearer <admin_token>
```

**Parameters:**

- `userId` (string): The ID of the user whose password to change

**Request Body:**

```json
{
    "newPassword": "newPassword123"
}
```

**Response (Success - 200):**

```json
{
    "statusCode": 200,
    "data": {
        "message": "Password updated successfully"
    },
    "message": "Password changed successfully",
    "success": true
}
```

#### GET /users/admin/admintest

Test endpoint for admin authentication.

**Headers:**

```
Authorization: Bearer <admin_token>
```

**Response (Success - 200):**

```json
{
    "statusCode": 200,
    "data": {
        "_id": "user_id",
        "email": "admin@example.com",
        "roles": ["admin"],
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z"
    },
    "message": "Admin is logged in",
    "success": true
}
```

---

### Role-Based Test Endpoints

#### GET /users/pl/pltest

Test endpoint for project lead authentication.

**Headers:**

```
Authorization: Bearer <project_lead_token>
```

**Response (Success - 200):**

```json
{
    "statusCode": 200,
    "data": {
        "_id": "user_id",
        "email": "pl@example.com",
        "roles": ["project lead"],
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z"
    },
    "message": "Accounts user is logged in",
    "success": true
}
```

#### GET /users/b/btest

Test endpoint for backend developer authentication.

**Headers:**

```
Authorization: Bearer <backend_token>
```

**Response (Success - 200):**

```json
{
    "statusCode": 200,
    "data": {
        "_id": "user_id",
        "email": "backend@example.com",
        "roles": ["backend"],
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z"
    },
    "message": "backend user is logged in",
    "success": true
}
```

#### GET /users/f/ftest

Test endpoint for frontend developer authentication.

**Headers:**

```
Authorization: Bearer <frontend_token>
```

**Response (Success - 200):**

```json
{
    "statusCode": 200,
    "data": {
        "_id": "user_id",
        "email": "frontend@example.com",
        "roles": ["frontend"],
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z"
    },
    "message": "Accounts user is logged in",
    "success": true
}
```

#### GET /users/d/dtest

Test endpoint for designer authentication.

**Headers:**

```
Authorization: Bearer <designer_token>
```

**Response (Success - 200):**

```json
{
    "statusCode": 200,
    "data": {
        "_id": "user_id",
        "email": "designer@example.com",
        "roles": ["designer"],
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z"
    },
    "message": "Accounts user is logged in",
    "success": true
}
```

#### GET /users/a/atest

Test endpoint for accounts manager authentication.

**Headers:**

```
Authorization: Bearer <accounts_token>
```

**Response (Success - 200):**

```json
{
    "statusCode": 200,
    "data": {
        "_id": "user_id",
        "email": "accounts@example.com",
        "roles": ["accounts"],
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z"
    },
    "message": "Accounts user is logged in",
    "success": true
}
```

---

## Data Models

### User Model

```json
{
    "_id": "ObjectId",
    "email": "string (required, unique, lowercase)",
    "password": "string (required, hashed)",
    "roles": [
        "array of strings (enum: admin, designer, frontend, backend, accounts, project lead, user)"
    ],
    "createdAt": "Date",
    "updatedAt": "Date"
}
```

### Staff Model

```json
{
    "_id": "ObjectId",
    "name": "string (required)",
    "internId": "string (unique, optional)",
    "employeeType": "string (enum: intern, full-time)",
    "status": "string (enum: active, inactive, default: active)",
    "user": "ObjectId (ref: User, required)",
    "createdAt": "Date",
    "updatedAt": "Date"
}
```

### Client Model

```json
{
    "_id": "ObjectId",
    "clientId": "number (auto-increment, unique)",
    "clientName": "string (required)",
    "clientPhone": "string (required, 10-digit validation)",
    "clientEmail": "string (required, email validation)",
    "GST": "string (optional, GST format validation)",
    "estimatedValue": "number (required, min: 0)",
    "confirmationBy": "string (enum: email, phone)",
    "billingType": "string (enum: annually, onetime, monthly)",
    "billingStatus": "string (enum: pending, paid, overdue, default: pending)",
    "createdAt": "Date",
    "updatedAt": "Date"
}
```
