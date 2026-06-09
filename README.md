# 🔥 PumaGasWeb

**Puma Electric & Gas Appliances** — A full-stack web application for browsing and managing gas and electric appliance products.

🌐 **Live Site:** [puma-gas-web.vercel.app](https://puma-gas-web.vercel.app)

---

## 📋 Table of Contents

- [About](#about)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Run with Docker (Recommended)](#run-with-docker-recommended)
  - [Run Manually](#run-manually)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## About

PumaGasWeb is the official web platform for **Puma Electric & Gas Appliances**. It provides customers with a seamless experience to explore products, and gives administrators tools to manage the catalog — all backed by a robust REST API and a MongoDB database.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React.js (Create React App) |
| **Backend** | Node.js / Express |
| **Database** | MongoDB |
| **Containerization** | Docker & Docker Compose |
| **Frontend Hosting** | Vercel |

---

## Project Structure

```
PumaGasWeb/
├── frontend/          # React application (CRA)
│   ├── Dockerfile
│   └── ...
├── backend/           # Node.js / Express API server
│   ├── Dockerfile
│   └── ...
├── docker-compose.yaml
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/) (local instance or Atlas URI)
- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/) *(for containerized setup)*

---

### Run with Docker (Recommended)

The easiest way to get both frontend and backend running together:

```bash
# Clone the repository
git clone https://github.com/PumaGas/PumaGasWeb.git
cd PumaGasWeb

# Start all services
docker compose up --build
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |

To stop all services:

```bash
docker compose down
```

---

### Run Manually

**1. Clone the repo**

```bash
git clone https://github.com/PumaGas/PumaGasWeb.git
cd PumaGasWeb
```

**2. Start the Backend**

```bash
cd backend
npm install
npm start
```

The API will be available at `http://localhost:8000`.

**3. Start the Frontend**

Open a new terminal:

```bash
cd frontend
npm install
npm start
```

The app will open at `http://localhost:3000`.

---

## Environment Variables

### Backend (`backend/.env`)

Create a `.env` file in the `backend/` directory with the following variables:

```env
NODE_ENV=development
PORT=8000
MONGO_URL=mongodb://localhost:27017/mydatabase
```

> In Docker, `MONGO_URL` is set automatically via `docker-compose.yaml`.

### Frontend (`frontend/.env`)

```env
REACT_APP_API_URL=http://localhost:8000
```

---

## Available Scripts

### Frontend

| Command | Description |
|---------|-------------|
| `npm start` | Start development server |
| `npm run build` | Build for production |
| `npm test` | Run tests |

### Backend

| Command | Description |
|---------|-------------|
| `npm start` | Start the API server |
| `npm run dev` | Start with hot-reload (if configured) |

---

## Deployment

- **Frontend** is deployed on **Vercel**. Every push to `main` triggers an automatic deployment.
- **Backend** can be deployed to any Node.js-compatible host (Railway, Render, Heroku, etc.).
- Make sure to update `REACT_APP_API_URL` in the Vercel environment settings to point to your live backend URL.

---

## Contributing

Contributions are welcome! To get started:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

> Built with ❤️ by the [PumaGas](https://github.com/PumaGas) team.
