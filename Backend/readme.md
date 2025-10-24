# API Documentation

This document provides documentation for the P5CRM API.

## Admin API

Base Path: `/api/v1/admin`

All endpoints under this path require admin authentication.

### Create Staff

- **Endpoint:** `/createStaff`
- **Method:** `POST`
- **Description:** Creates a new staff member and a corresponding user account.
- **Request Body:**
    ```json
    {
        "name": "string (required)",
        "email": "string (required, unique)",
        "password": "string (required)",
        "role": "string (required)",
        "staffId": "string (required, unique)",
        "employeeType": "string (required, enum: 'employee', 'intern', 'others')",
        "status": "string (optional, default: 'active')"
    }
    ```
- **Response:**
    - **201 Created:**
        ```json
        {
            "statusCode": 201,
            "data": {
                "user": {
                    "email": "string",
                    "roles": ["string"],
                    "_id": "ObjectId",
                    "createdAt": "Date",
                    "updatedAt": "Date"
                },
                "staff": {
                    "name": "string",
                    "staffId": "string",
                    "employeeType": "string",
                    "status": "string",
                    "user": "ObjectId",
                    "_id": "ObjectId",
                    "createdAt": "Date",
                    "updatedAt": "Date"
                }
            },
            "message": "Staff created successfully"
        }
        ```
    - **400 Bad Request:** If required fields are missing, email is a duplicate, or validation fails.
- **Validation:**
    - All fields (`name`, `email`, `password`, `role`, `staffId`, `employeeType`) are required.
    - `employeeType` must be one of 'employee', 'intern', or 'others'.
    - `staffId` format for 'employee' must be 'PDS-XXX' or 'PDS-XXX/R'.
    - `staffId` format for 'intern' must be 'PDSI-XXX' or 'PDSI-XXX/R'.
    - The `email` must be unique.

### List All Staff

- **Endpoint:** `/listAllStaff`
- **Method:** `GET`
- **Description:** Retrieves a list of all staff members.
- **Response:**
    - **200 OK:**
        ```json
        {
            "statusCode": 200,
            "data": [
                {
                    "_id": "ObjectId",
                    "name": "string",
                    "staffId": "string",
                    "employeeType": "string",
                    "status": "string",
                    "user": {
                        "_id": "ObjectId",
                        "email": "string",
                        "roles": ["string"]
                    },
                    "createdAt": "Date",
                    "updatedAt": "Date"
                }
            ],
            "message": "Fetched all staff"
        }
        ```

### Update Staff

- **Endpoint:** `/updateStaff/:staffId`
- **Method:** `PATCH`
- **Description:** Updates a staff member's information.
- **URL Parameters:**
    - `staffId`: The ID of the staff member to update.
- **Request Body:**
    ```json
    {
        "name": "string",
        "email": "string",
        "role": "string",
        "staffId": "string",
        "employeeType": "string",
        "status": "string"
    }
    ```
- **Response:**
    - **200 OK:**
        ```json
        {
            "statusCode": 200,
            "data": {
                "_id": "ObjectId",
                "name": "string",
                "staffId": "string",
                "employeeType": "string",
                "status": "string",
                "user": {
                    "_id": "ObjectId",
                    "email": "string",
                    "roles": ["string"]
                },
                "createdAt": "Date",
                "updatedAt": "Date"
            },
            "message": "Staff updated successfully"
        }
        ```
    - **404 Not Found:** If the staff member is not found.

### Change Password

- **Endpoint:** `/change-password/:staffId`
- **Method:** `PATCH`
- **Description:** Changes the password for a user associated with a staff member.
- **URL Parameters:**
    - `staffId`: The ID of the staff member.
- **Request Body:**
    ```json
    {
        "newPassword": "string (required)"
    }
    ```
- **Response:**
    - **200 OK:**
        ```json
        {
            "statusCode": 200,
            "data": {
                "message": "Password updated successfully"
            },
            "message": "Password changed successfully"
        }
        ```
    - **400 Bad Request:** If `newPassword` is not provided.
    - **404 Not Found:** If the staff member or associated user is not found.

### Create Client

- **Endpoint:** `/createClient`
- **Method:** `POST`
- **Description:** Creates a new client.
- **Request Body:**
    ```json
    {
        "clientName": "string (required)",
        "clientPhone": "string (required, unique)",
        "clientEmail": "string (required, unique)",
        "GST": "string (required)",
        "billingType": "string (required)",
        "billingStatus": "string (optional, default: 'pending')"
    }
    ```
- **Response:**
    - **201 Created:**
        ```json
        {
            "statusCode": 201,
            "data": {
                "_id": "ObjectId",
                "clientName": "string",
                "clientPhone": "string",
                "clientEmail": "string",
                "GST": "string",
                "billingType": "string",
                "billingStatus": "string",
                "createdAt": "Date",
                "updatedAt": "Date"
            },
            "message": "Client created successfully"
        }
        ```
    - **400 Bad Request:** If required fields are missing or if a client with the same email or phone already exists.

### List All Clients

- **Endpoint:** `/listAllClients`
- **Method:** `GET`
- **Description:** Retrieves a list of all clients.
- **Response:**
    - **200 OK:**
        ```json
        {
            "statusCode": 200,
            "data": [
                {
                    "_id": "ObjectId",
                    "clientName": "string",
                    "clientPhone": "string",
                    "clientEmail": "string",
                    "GST": "string",
                    "billingType": "string",
                    "billingStatus": "string",
                    "createdAt": "Date",
                    "updatedAt": "Date"
                }
            ],
            "message": "Clients fetched successfully"
        }
        ```

### Create Project

- **Endpoint:** `/createProject`
- **Method:** `POST`
- **Description:** Creates a new project.
- **Request Body:**
    ```json
    {
        "clientName": "ObjectId (required)",
        "projectID": "string (required, unique, format: PDSXXX)",
        "projectName": "string (required)",
        "projectValue": "number (required)",
        "advancePayment": "number (optional, default: 0)",
        "paymentDate": "string (required, format: dd-mm-yyyy)",
        "projectLead": "ObjectId (required)",
        "designer": "ObjectId (required)",
        "frontend": "ObjectId (required)",
        "backend": "ObjectId (required)",
        "deadline": "string (required, format: dd-mm-yyyy)",
        "awsDetails": {
            "id": "string (required)",
            "password": "string (required)"
        },
        "requirement": "string",
        "sow": "string",
        "status": "string (optional)"
    }
    ```
- **Response:**
    - **201 Created:**
        ```json
        {
            "statusCode": 201,
            "data": {
                "_id": "ObjectId",
                "clientName": "ObjectId",
                "projectID": "string",
                "projectName": "string",
                "projectValue": "number",
                "advancePayment": "number",
                "paymentDate": "Date",
                "projectLead": "ObjectId",
                "designer": "ObjectId",
                "frontend": "ObjectId",
                "backend": "ObjectId",
                "deadline": "Date",
                "awsDetails": {
                    "id": "string",
                    "password": "string"
                },
                "requirement": "string",
                "sow": "string",
                "status": "string",
                "createdAt": "Date",
                "updatedAt": "Date"
            },
            "message": "Project created successfully"
        }
        ```
    - **400 Bad Request:** If required fields are missing or validation fails.

### List All Projects

- **Endpoint:** `/listAllProjects`
- **Method:** `GET`
- **Description:** Retrieves a list of all projects.
- **Response:**
    - **200 OK:**
        ```json
        {
            "statusCode": 200,
            "data": [
                {
                    "_id": "ObjectId",
                    "clientName": "ObjectId",
                    "projectID": "string",
                    "projectName": "string",
                    "projectValue": "number",
                    "advancePayment": "number",
                    "paymentDate": "Date",
                    "projectLead": "ObjectId",
                    "designer": "ObjectId",
                    "frontend": "ObjectId",
                    "backend": "ObjectId",
                    "deadline": "Date",
                    "awsDetails": {
                        "id": "string",
                        "password": "string"
                    },
                    "requirement": "string",
                    "sow": "string",
                    "status": "string",
                    "createdAt": "Date",
                    "updatedAt": "Date"
                }
            ],
            "message": "Fetched all project"
        }
        ```

### Update Project

- **Endpoint:** `/updateProject/:projectId`
- **Method:** `PATCH`
- **Description:** Updates a project's information.
- **URL Parameters:**
    - `projectId`: The ID of the project to update.
- **Request Body:**
    ```json
    {
        "projectID": "string",
        "projectName": "string",
        "projectValue": "number",
        "advancePayment": "number",
        "paymentDate": "string (format: dd-mm-yyyy)",
        "projectLead": "ObjectId",
        "designer": "ObjectId",
        "frontend": "ObjectId",
        "backend": "ObjectId",
        "deadline": "string (format: dd-mm-yyyy)",
        "awsDetails": {
            "id": "string",
            "password": "string"
        },
        "sow": "string",
        "status": "string (enum: 'in progress', 'completed', 'cancelled', 'on hold')"
    }
    ```
- **Response:**
    - **200 OK:**
        ```json
        {
            "statusCode": 200,
            "data": {
                "_id": "ObjectId",
                "clientName": "ObjectId",
                "projectID": "string",
                "projectName": "string",
                "projectValue": "number",
                "advancePayment": "number",
                "paymentDate": "Date",
                "projectLead": "ObjectId",
                "designer": "ObjectId",
                "frontend": "ObjectId",
                "backend": "ObjectId",
                "deadline": "Date",
                "awsDetails": {
                    "id": "string",
                    "password": "string"
                },
                "requirement": "string",
                "sow": "string",
                "status": "string",
                "createdAt": "Date",
                "updatedAt": "Date"
            },
            "message": "Project updated successfully"
        }
        ```
    - **400 Bad Request:** If validation fails.
    - **404 Not Found:** If the project is not found.

## Backend API

Base Path: `/api/v1/backend`

All endpoints under this path require backend authentication.

### List Backend Projects

- **Endpoint:** `/list-projects`
- **Method:** `GET`
- **Description:** Retrieves a list of all projects assigned to the logged-in backend developer.
- **Response:**
    - **200 OK:**
        ```json
        {
            "statusCode": 200,
            "data": [
                {
                    "projectID": "string",
                    "projectName": "string",
                    "Description": "string",
                    "projectLead": "string",
                    "createdOn": "Date",
                    "deadline": "Date",
                    "status": "string",
                    "figma": "string",
                    "awsDetails": {
                        "id": "string",
                        "password": "string"
                    },
                    "apiEndpoints": [
                        {
                            "endpoint": "string",
                            "description": "string",
                            "implemented": "boolean",
                            "verified": "boolean",
                            "_id": "ObjectId"
                        }
                    ]
                }
            ],
            "message": "Projects fetched successfully"
        }
        ```

### Implement API Endpoint

- **Endpoint:** `/implement-api/:projectID/:apiId`
- **Method:** `PATCH`
- **Description:** Marks an API endpoint as implemented.
- **URL Parameters:**
    - `projectID`: The ID of the project.
    - `apiId`: The ID of the API endpoint.
- **Response:**
    - **200 OK:**
        ```json
        {
            "statusCode": 200,
            "data": {
                "_id": "ObjectId",
                "project": "ObjectId",
                "apiRepository": [
                    {
                        "endpoint": "string",
                        "description": "string",
                        "implemented": true,
                        "verified": "boolean",
                        "implementedBy": "ObjectId",
                        "_id": "ObjectId"
                    }
                ]
            },
            "message": "API endpoint marked as implemented"
        }
        ```
    - **403 Forbidden:** If the user is not authorized to implement APIs for this project.
    - **404 Not Found:** If the project or API endpoint is not found.

## Designer API

Base Path: `/api/v1/designer`

All endpoints under this path require designer authentication.

### List Designer Projects

- **Endpoint:** `/list-projects`
- **Method:** `GET`
- **Description:** Retrieves a list of all projects assigned to the logged-in designer.
- **Response:**
    - **200 OK:**
        ```json
        {
            "statusCode": 200,
            "data": [
                {
                    "projectID": "string",
                    "projectName": "string",
                    "Description": "string",
                    "projectLead": "string",
                    "createdOn": "Date",
                    "deadline": "Date",
                    "designStatus": "string",
                    "uploadfigma": "string"
                }
            ],
            "message": "Projects fetched successfully"
        }
        ```

### Update Design Status

- **Endpoint:** `/update-status/:projectID`
- **Method:** `PATCH`
- **Description:** Updates the design status of a project.
- **URL Parameters:**
    - `projectID`: The ID of the project.
- **Request Body:**
    ```json
    {
        "designStatus": "string (required, enum: 'in progress', 'not started', 'on hold', 'completed')"
    }
    ```
- **Response:**
    - **200 OK:**
        ```json
        {
            "statusCode": 200,
            "data": {
                "_id": "ObjectId",
                "projectID": "string",
                "projectName": "string",
                "sow": "string",
                "createdAt": "Date",
                "deadline": "Date",
                "designStatus": "string",
                "requirement": "string"
            },
            "message": "Design status updated successfully"
        }
        ```
    - **400 Bad Request:** If `designStatus` is missing or invalid.
    - **403 Forbidden:** If the user is not authorized to update this project.
    - **404 Not Found:** If the project is not found.

### Update Figma Link

- **Endpoint:** `/update-figma/:projectID`
- **Method:** `PATCH`
- **Description:** Updates the Figma link for a project.
- **URL Parameters:**
    - `projectID`: The ID of the project.
- **Request Body:**
    ```json
    {
        "figmaLink": "string (required)"
    }
    ```
- **Response:**
    - **200 OK:**
        ```json
        {
            "statusCode": 200,
            "data": {
                "_id": "ObjectId",
                "projectID": "string",
                "projectName": "string",
                "sow": "string",
                "createdAt": "Date",
                "deadline": "Date",
                "designStatus": "string",
                "requirement": "string"
            },
            "message": "Figma link updated successfully"
        }
        ```
    - **400 Bad Request:** If `figmaLink` is not provided.
    - **403 Forbidden:** If the user is not authorized to update this project.
    - **404 Not Found:** If the project is not found.

## Frontend API

Base Path: `/api/v1/frontend`

All endpoints under this path require frontend authentication.

### List Frontend Projects

- **Endpoint:** `/list-projects`
- **Method:** `GET`
- **Description:** Retrieves a list of all projects assigned to the logged-in frontend developer.
- **Response:**
    - **200 OK:**
        ```json
        {
            "statusCode": 200,
            "data": [
                {
                    "projectID": "string",
                    "projectName": "string",
                    "Description": "string",
                    "projectLead": "string",
                    "createdOn": "Date",
                    "deadline": "Date",
                    "status": "string",
                    "figma": "string",
                    "awsDetails": {
                        "id": "string",
                        "password": "string"
                    },
                    "apiEndpoints": [
                        {
                            "endpoint": "string",
                            "description": "string",
                            "implemented": "boolean",
                            "verified": "boolean",
                            "_id": "ObjectId"
                        }
                    ]
                }
            ],
            "message": "Projects fetched successfully"
        }
        ```

### Add API Endpoint

- **Endpoint:** `/add-api/:projectID`
- **Method:** `POST`
- **Description:** Adds a new API endpoint requirement to a project.
- **URL Parameters:**
    - `projectID`: The ID of the project.
- **Request Body:**
    ```json
    {
        "endpoint": "string (required)",
        "method": "string (required, enum: GET, POST, PUT, DELETE, PATCH)",
        "requestFormat": "object",
        "responseFormat": "object"
    }
    ```
- **Response:**
    - **200 OK:**
        ```json
        {
            "statusCode": 200,
            "data": {
                "_id": "ObjectId",
                "project": "ObjectId",
                "apiRepository": [
                    {
                        "endpoint": "string",
                        "method": "string",
                        "requestFormat": "object",
                        "responseFormat": "object",
                        "_id": "ObjectId"
                    }
                ]
            },
            "message": "API endpoint added successfully"
        }
        ```
    - **400 Bad Request:** If required fields are missing or invalid.
    - **403 Forbidden:** If the user is not authorized to add API endpoints to this project.
    - **404 Not Found:** If the project is not found.

### Verify API Endpoint

- **Endpoint:** `/verify-api/:projectID/:apiId`
- **Method:** `PATCH`
- **Description:** Marks an API endpoint as verified by the frontend.
- **URL Parameters:**
    - `projectID`: The ID of the project.
    - `apiId`: The ID of the API endpoint.
- **Response:**
    - **200 OK:**
        ```json
        {
            "statusCode": 200,
            "data": {
                "_id": "ObjectId",
                "project": "ObjectId",
                "apiRepository": [
                    {
                        "endpoint": "string",
                        "description": "string",
                        "implemented": true,
                        "verified": true,
                        "implementedBy": "ObjectId",
                        "_id": "ObjectId"
                    }
                ]
            },
            "message": "API endpoint verified successfully"
        }
        ```
    - **400 Bad Request:** If the API has not been implemented yet.
    - **403 Forbidden:** If the user is not authorized to verify APIs for this project.
    - **404 Not Found:** If the project or API endpoint is not found.

## Project Lead API

Base Path: `/api/v1/project-lead`

All endpoints under this path require project lead authentication.

### List All Projects

- **Endpoint:** `/list-projects`
- **Method:** `GET`
- **Description:** Retrieves a list of all projects for the logged-in project lead.
- **Response:**
    - **200 OK:**
        ```json
        {
            "statusCode": 200,
            "data": [
                {
                    "_id": "ObjectId",
                    "project": {
                        "_id": "ObjectId",
                        "projectID": "string",
                        "projectName": "string",
                        "sow": "string",
                        "createdAt": "Date",
                        "deadline": "Date",
                        "status": "string",
                        "awsDetails": {
                            "id": "string",
                            "password": "string"
                        },
                        "features": []
                    },
                    "apiRepository": [],
                    "pushToP5Repo": false
                }
            ],
            "message": "Projects fetched successfully"
        }
        ```

### Edit Project

- **Endpoint:** `/edit-project/:projectID`
- **Method:** `PATCH`
- **Description:** Edits a project's repository details.
- **URL Parameters:**
    - `projectID`: The ID of the project.
- **Request Body:**
    ```json
    {
        "pushToP5Repo": "boolean"
    }
    ```
- **Response:**
    - **200 OK:**
        ```json
        {
            "statusCode": 200,
            "data": {
                "_id": "ObjectId",
                "project": {
                    "_id": "ObjectId",
                    "projectID": "string",
                    "projectName": "string",
                    "sow": "string",
                    "createdAt": "Date",
                    "deadline": "Date",
                    "status": "string",
                    "awsDetails": {
                        "id": "string",
                        "password": "string"
                    },
                    "features": []
                },
                "apiRepository": [],
                "pushToP5Repo": true
            },
            "message": "Project details updated successfully"
        }
        ```
    - **404 Not Found:** If the project or project lead details are not found.

## User API

Base Path: `/api/v1/users`

### Login User

- **Endpoint:** `/login`
- **Method:** `POST`
- **Description:** Logs in a user and returns an access token.
- **Request Body:**
    ```json
    {
        "email": "string (required)",
        "password": "string (required)",
        "role": "string (required)"
    }
    ```
- **Response:**
    - **200 OK:**
        ```json
        {
            "statusCode": 200,
            "data": "string (access token)",
            "message": "Login successful"
        }
        ```
    - **400 Bad Request:** If email, password, or role are not provided, or if credentials do not match.

### Backend Test Route

- **Endpoint:** `/b/btest`
- **Method:** `GET`
- **Description:** A test route for backend users. Requires backend authentication.
- **Response:**
    - **200 OK:**
        ```json
        {
            "statusCode": 200,
            "data": {
                "_id": "ObjectId",
                "email": "string",
                "roles": ["backend"]
            },
            "message": "backend user is logged in"
        }
        ```

### Frontend Test Route

- **Endpoint:** `/f/ftest`
- **Method:** `GET`
- **Description:** A test route for frontend users. Requires frontend authentication.
- **Response:**
    - **200 OK:**
        ```json
        {
            "statusCode": 200,
            "data": {
                "_id": "ObjectId",
                "email": "string",
                "roles": ["frontend"]
            },
            "message": "Accounts user is logged in"
        }
        ```

### Accounts Test Route

- **Endpoint:** `/a/atest`
- **Method:** `GET`
- **Description:** A test route for accounts users. Requires accounts authentication.
- **Response:**
    - **200 OK:**
        ```json
        {
            "statusCode": 200,
            "data": {
                "_id": "ObjectId",
                "email": "string",
                "roles": ["accounts"]
            },
            "message": "Accounts user is logged in"
        }
        ```
