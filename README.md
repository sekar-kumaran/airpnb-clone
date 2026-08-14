# Airbnb Clone - SDE Fullstack Assignment

This project is a functional, full-stack clone of the Airbnb web application built as part of an SDE recruitment process. It replicates Airbnb's design, user experience, and core marketplace workflows (browsing, searching, booking, and hosting).

## 🚀 Live Deployments

- **Frontend (Vercel):** [https://airpnb-clone.vercel.app/](https://airpnb-clone.vercel.app/)
- **Backend (Render):** [https://airpnb-clone-3o3u.onrender.com](https://airpnb-clone-3o3u.onrender.com)
- **API Docs:** [https://airpnb-clone-3o3u.onrender.com/docs](https://airpnb-clone-3o3u.onrender.com/docs)

> **Note on Free Tier:** The backend is hosted on Render's free tier. If the backend is inactive for 15 minutes, it goes to sleep. If you open the frontend and see no listings, please wait ~50 seconds for the backend to wake up and refresh the page. The SQLite database is ephemeral and automatically repopulates with seed data on every startup!

## 📋 Assignment Requirements

The assignment asked to build a functional clone of Airbnb that replicates its core workflows within the clean, photo-forward interface of the original app:
- Browse and search property listings.
- View listing details and filter by criteria.
- Book stays for a date range.
- Act as a host to create and manage own listings.
- Visually and functionally match the original application exactly.
- (Mocked data, images, and payments are permitted).

## 🏗️ What We Built

We delivered a highly polished, production-ready clone that strictly adheres to the requirements:
- **Photo-forward UI:** Large rounded-corner images, category rails, truncated titles, and exact typography matching Airbnb.
- **Dynamic Search Bar:** Airbnb-style sticky header that smoothly collapses on scroll and expands on click, with specific category sections (Homes, Experiences, Services).
- **Listing Detail & Booking Flow:** Hero photo grid, sticky booking card, interactive calendar, date overlap validation (cannot book unavailable dates), and total price breakdown.
- **Advanced Wishlists:** Grouped wishlist "folders" where users can organize their saved listings. Includes a beautiful split-view layout with a map placeholder on the right side.
- **Host Dashboard:** Allows hosts to manage properties (CRUD) and view reservation stats.
- **Trips Management:** Cancellation flows using in-app modals.
- **Mocked Auth:** Simple email-based auth simulation (`test@example.com`).

## 🛠️ Tech Stack & DevOps Workflow

### Technologies
- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend:** Python FastAPI, SQLAlchemy, SQLite (ephemeral with auto-seeding)
- **State Management:** React Context (Wishlists, Auth)

### DevOps & CI/CD Pipeline
We designed a complete professional DevOps pipeline using modern tools:
1. **GitHub Actions (CI):** On every push, runs backend linting (`ruff`), testing (`pytest`), and frontend checks (`eslint`, `tsc`, Next.js build).
2. **Jenkins (CD):** A Jenkins pipeline is configured (via `Jenkinsfile`) that handles robust multi-stage testing, builds Docker images, and can deploy to Kubernetes. 
3. **Containerization:** Complete `Dockerfile`s and `docker-compose.yml` orchestrating the frontend and backend.
4. **Kubernetes:** Manifest files configured for scaling and orchestration.
5. **Serverless Deployment:** Frontend seamlessly deployed to Vercel. Backend deployed to Render via native Docker container support.

## 📂 Project Structure

```text
airbnb-clone/
├── frontend/                 # Next.js App Router, Tailwind, Components
│   ├── app/                  # Pages and Routing
│   ├── components/           # Reusable UI components
│   └── lib/                  # API client and utilities
├── backend/                  # FastAPI Application
│   ├── app/
│   │   ├── models/           # SQLAlchemy DB schema
│   │   ├── routers/          # API endpoints (Listings, Bookings, Wishlists)
│   │   └── seed.py           # Populates DB on startup
│   └── tests/                # Pytest suites
├── k8s/                      # Kubernetes deployment manifests
├── Jenkinsfile               # Jenkins CI/CD pipeline definition
├── docker-compose.yml        # Local dev orchestration
└── .github/workflows/        # GitHub Actions CI workflow
```

## 💻 Local Development

### Using Docker
```bash
docker compose up --build
```
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`

### Manual Setup
**Backend:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # (Windows)
pip install -r requirements.txt
uvicorn app.main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```
