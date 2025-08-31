# LMS Project

A simple **Library Management System (LMS)** built with **Laravel (backend)** and **React (frontend)**, fully dockerized for easy setup.

---

## Features

- User authentication (login/register)  
- Book management (CRUD)  
- Borrow record tracking  
- Role-based access (admin, member/librarian)  
- REST API endpoints with Laravel  
- Responsive React frontend  
- Dockerized backend, frontend, and MySQL database  

---

## Project Structure  
lms/  
├── backend/ # Laravel backend  
├── frontend/ # React frontend  
├── docker/ # Nginx & other Docker configs  
├── docker-compose.yml  
└── Makefile  

---

## Prerequisites  

- [Docker](https://www.docker.com/get-started)  
- [Docker Compose](https://docs.docker.com/compose/install/)  

---

## Setup Instructions

1. **Clone the repository:**  
git clone <YOUR_GITHUB_REPO_URL>  
cd lms  
2. **Copy .env for backend (optional):**  
cd backend  
cp .env.example .env  
php artisan key:generate  
3. **Build and start containers:**  
cd /d/myproject/lms  
docker-compose up --build -d  
Run migrations and seeders (backend):  
docker-compose exec backend php artisan migrate --seed  
Access the application:  

Frontend: http://localhost:3000  

Backend API: http://localhost:8080  

---
## Running Tests  
1. **Backend unit & feature tests:**  
   docker-compose exec backend ./vendor/bin/phpunit  

   - Uses .env.testing for testing environment  

   - Ensure APP_KEY is set in .env.testing  

Notes  

- .env files are not included in GitHub for security.  

- Frontend and backend are in the same repo.  

- Docker Compose includes:  

- backend: Laravel PHP app  

- frontend: React app  

- db: MySQL database  
  
- nginx: Reverse proxy  
