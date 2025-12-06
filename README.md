# 📁 FlowShare – File Sharing Web App (Google Drive Lite)

A full-stack **file sharing platform** built using the **MERN stack**, allowing users to securely **upload files, manage them, share with users, generate temporary access links, and download files** — similar to a simplified Google Drive.

---

## 🚀 Features

### 🔐 Authentication
- User registration & login using **JWT**
- Auth token stored securely in **localStorage**

### 📤 File Management
- Upload **multiple files**
- File metadata stored in **MongoDB**
- Files listed in **Dashboard**
- **Delete** your uploaded files anytime

### 🤝 Sharing System
- Share files with other **registered users via email**
- Access files **shared with you**
- Generate **shareable links** with optional expiry time

### 📥 Security & Access Control
A user can access a file only if:

✔ They are the **owner**  
✔ File is **shared with their account**  
✔ OR accessed via **valid share link** & authenticated  

⚠ Unauthorized access is blocked even if URL is known.

---

## 🛠 Tech Stack

| Category | Tools |
|--------|-------|
| **Frontend** | React, Vite, Axios, React Router |
| **Backend** | Node.js, Express.js, Multer |
| **Database** | MongoDB with Mongoose |
| **Auth** | JSON Web Token (JWT) |
| **UI** | Modern Custom CSS (No framework) |

---

## 🏗 Project Structure


file-sharing-app-final/
│── backend/
│ ├── src/
│ │ ├── config/db.js
│ │ ├── models/User.js
│ │ ├── models/File.js
│ │ ├── middleware/auth.js
│ │ ├── routes/authRoutes.js
│ │ ├── routes/fileRoutes.js
│ │ └── server.js
│ ├── uploads/ (auto created)
│ ├── .env.example
│ └── package.json
│
└── frontend/
├── src/
│ ├── api/axios.js
│ ├── components/
│ ├── pages/
│ └── App.jsx
├── index.html
├── index.css
└── package.json




## 🏁 Run Locally

### 1️⃣ Project Structure

file-sharing-app-final/
├─ backend/
└─ frontend/

yaml
Copy code

---

### 2️⃣ Start Backend

```bash
cd file-sharing-app-final/backend
cp .env.example .env   # Windows users: rename .env.example ➝ .env manually
npm install
npm run dev
Backend runs at → http://localhost:5000

✔ Ensure MongoDB is running locally

3️⃣ Start Frontend
Open a new terminal:

bash
Copy code
cd file-sharing-app-final/frontend
npm install
npm run dev
Frontend runs at → http://localhost:5173
