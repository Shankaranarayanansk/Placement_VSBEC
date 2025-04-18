# 📘 Placement Cell Portal API Documentation

**Base URL**  
`http://localhost:PORT/api`  
(Replace `PORT` with your server's port)

---

## 🔐 Authentication

Most endpoints require JWT authentication.  
Include token in header:

```
Authorization: Bearer <your_jwt_token>
```

---

## 1. 🔑 Authentication Endpoints

### 1.1 Login User/Admin

- **Endpoint:** `POST /auth/login`  
- **Access:** Public  
- **Steps:**
  - Send `email` and `password` in the request body.
  - Receive JWT token in response.
  - Store token for future authenticated requests.

---

### 1.2 Get Current User

- **Endpoint:** `GET /auth/me`  
- **Access:** Private (requires token)  
- **Steps:**
  - Include token in `Authorization` header.
  - Receive current user profile data.

---

## 2. 🎓 Student Actions

### 2.1 Get Student Profile

- **Endpoint:** `GET /student/profile`  
- **Access:** Private (Student only)  
- **Steps:**
  - Include student token in `Authorization` header.
  - Receive detailed student placement profile.

---

### 2.2 Create/Update Student Profile

- **Endpoint:** `POST /student/profile`  
- **Access:** Private (Student only)  
- **Steps:**
  - Include student token in `Authorization` header.
  - Send student profile data in the request body.
  - Receive created/updated profile in response.

---

## 3. 🛠️ Admin Actions

### 3.1 Get All Students

- **Endpoint:** `GET /admin/students`  
- **Access:** Private (Admin only)  
- **Steps:**
  - Include admin token in `Authorization` header.
  - Use optional query parameters for filtering:  
    - `placed`, `department`, `search`
  - Receive list of student profiles.

---

### 3.2 Get Student by ID

- **Endpoint:** `GET /admin/students/:id`  
- **Access:** Private (Admin only)  
- **Steps:**
  - Include admin token in `Authorization` header.
  - Provide student MongoDB `id` in the URL path.
  - Receive specific student’s profile.

---

### 3.3 Get Placement Analytics

- **Endpoint:** `GET /admin/analytics`  
- **Access:** Private (Admin only)  
- **Steps:**
  - Include admin token in `Authorization` header.
  - Receive aggregated placement statistics including:
    - Department-wise stats
    - Company offer distribution
    - Overall metrics

---

### 3.4 Export Student Data as CSV

- **Endpoint:** `GET /admin/export`  
- **Access:** Private (Admin only)  
- **Steps:**
  - Include admin token in `Authorization` header.
  - Use optional query parameters for filtering:  
    - `placed`, `department`, `search`
  - Receive CSV file with filtered student data.

---