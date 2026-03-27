---
name: 🛠️ backend-api-design
description: Design clean, RESTful or GraphQL API architectures. Use this skill when asked to plan out an API, design endpoints, define schemas, or architect backend services.
---

# Backend API Designer

This skill is designed to guide the architecture and design of backend APIs, focusing on best practices for RESTful principles, security, and scalability.

## Guidelines for API Design

When designing an API structure, adhere to these principles:

1. **Resource-Oriented Design (REST)**: Use nouns for paths, not verbs. e.g., `/users/{id}` instead of `/getUserById`.
2. **HTTP Methods**: Map actions strictly to the correct HTTP methods (`GET` for reading, `POST` for creation, `PUT/PATCH` for updates, `DELETE` for removal).
3. **Status Codes**: Use standard HTTP status codes correctly (`200 OK`, `201 Created`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `500 Internal Server Error`).
4. **Versioning**: Include API versioning in the URL (`/api/v1/users`) or headers.
5. **Pagination & Filtering**: Standardize pagination (e.g., `?page=1&limit=20`) and filtering (e.g., `?status=active`).
6. **Error Handling**: Define a consistent error response format.
   ```json
   {
     "error": {
       "code": "VALIDATION_FAILED",
       "message": "The provided email address is invalid.",
       "details": [ ... ]
     }
   }
   ```
7. **Security**: Ensure authentication (e.g., JWT, OAuth) and authorization are considered and documented for endpoints.

## Required Output Format

When tasked with designing an API, provide the following structure:

### 1. Overview
A brief description of the API's purpose and target audience.

### 2. Base URL
Provide the base URL and any versioning strategy. Example: `https://api.example.com/v1`

### 3. Authentication Strategy
Describe how clients authenticate with the API (e.g., Bearer tokens in the `Authorization` header).

### 4. Endpoints Definition
For each major resource, list the endpoints in a table or structured format:

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/v1/resources` | List all resources | Yes |
| `POST` | `/api/v1/resources` | Create a new resource | Yes (Admin) |

### 5. Detailed Endpoint Specs
For complex endpoints, provide details on Request Body (JSON schema), Query Parameters, and Response Body formats (including success and error states).

### 6. Data Models (Schemas)
Provide high-level entity relationship diagrams or JSON schemas representing the core data structures used by the API.
