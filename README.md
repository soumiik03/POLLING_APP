# 🗳️ Polling App

A modern full-stack polling platform that allows users to create polls, share them through public links, and collect responses seamlessly. Designed with scalability, simplicity, and a responsive user experience in mind.

## ✨ Features

* Create polls with multiple questions
* Configure mandatory and optional questions
* Single-choice answer support
* Public shareable poll links
* Anonymous or authenticated participation
* Poll expiration management
* Responsive design across devices
* Secure backend API architecture
* MongoDB-powered data persistence

## 🚀 Tech Stack

### Frontend

* React
* Vite
* Axios
* CSS

### Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose

## 📂 Project Structure

```bash
polling-app/
├── client/             # Frontend application
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/             # Backend API
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── package.json
│
└── README.md
```

## ⚙️ Installation

### Clone the Repository

```bash
git clone https://github.com/your-username/polling-app.git
cd polling-app
```

### Install Frontend Dependencies

```bash
cd client
npm install
```

### Install Backend Dependencies

```bash
cd ../server
npm install
```

## 🔑 Environment Variables

Create a `.env` file inside the server directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

## ▶️ Run the Application

### Start Backend

```bash
cd server
npm run dev
```

### Start Frontend

```bash
cd client
npm run dev
```

## 🌐 API Overview

| Method | Endpoint           | Description        |
| ------ | ------------------ | ------------------ |
| POST   | /polls             | Create a new poll  |
| GET    | /polls/:id         | Fetch poll details |
| POST   | /responses         | Submit a response  |
| GET    | /polls/:id/results | Get poll results   |

## 🎯 Learning Outcomes

This project demonstrates:

* REST API development
* MongoDB schema design
* Frontend-backend integration
* State management in React
* Full-stack application architecture
* Deployment-ready project structure

## 📄 License

This project is open-source and available under the MIT License.
