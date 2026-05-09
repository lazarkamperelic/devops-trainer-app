# DevOps Trainer

A web-based matching game where players connect function descriptions to their corresponding commands. Covers Linux, Git, Docker, Kubernetes, Terraform, and AWS CLI — designed as a hands-on study tool for DevOps learners.

---

## Features

- **6 DevOps categories** — Linux, Git, Docker, Kubernetes, Terraform, AWS CLI
- **14 subcategories** — file system, permissions, networking, pods, deployments, S3, EC2, IAM, and more
- **Match–pair gameplay** — click a function description, then click its matching command
- **Configurable timer** — 30s, 60s, or 90s rounds
- **Score tracking** — real-time score during play
- **Accuracy tracking** — percentage of correct attempts
- **High score persistence** — per-category/subcategory via `localStorage`
- **Dynamic card replacement** — matched pairs are immediately swapped with new questions
- **Health & info API endpoints** — ready for monitoring and orchestration
- **Responsive dark UI** — works on desktop and mobile
- **Docker support** — containerized with Docker Compose

## Screenshots

### Home Screen

![Home Screen](screenshots/home-screen.png)

### Gameplay

![Gameplay](screenshots/gameplay.png)

### Final Score

![Final Score](screenshots/final-score.png)

## Tech Stack

| Layer        | Technology            |
|--------------|-----------------------|
| Backend      | Python 3, Flask       |
| Frontend     | HTML, CSS, JavaScript |
| Container    | Docker                |
| Orchestration| Docker Compose        |

## Project Structure

```
.
├── AGENTS.md              # Agent instructions for code editing assistants
├── Dockerfile             # Docker image definition
├── README.md              # Project documentation (this file)
├── app.py                 # Flask application & API routes
├── data/
│   └── questions.json     # Question bank (categories, subcategories, pairs)
├── docker-compose.yml     # Compose service configuration
├── requirements.txt       # Python dependencies
├── screenshots/
│   ├── final-score.png    # Final score screen
│   ├── gameplay.png       # Gameplay screen
│   └── home-screen.png    # Home screen
├── static/
│   ├── favicon.png        # Favicon
│   ├── script.js          # Game logic
│   └── style.css          # Styles
├── templates/
│   └── index.html         # Single-page game UI
├── .dockerignore          # Docker build exclusions
└── .gitignore
```

## API Routes

| Method | Route                                          | Description                        | Example Response                          |
|--------|-------------------------------------------------|------------------------------------|-------------------------------------------|
| GET    | `/`                                             | Serves the game UI                 | HTML page                                 |
| GET    | `/api/categories`                               | Returns all categories             | `{"linux": {"name": "Linux", ...}}`       |
| GET    | `/api/questions/<category>/<subcategory>`       | Returns questions for a pair       | `[{"cmd": "ls", "desc": "List..."}, ...]` |
| GET    | `/health`                                       | Health check                       | `{"status": "healthy"}`                   |
| GET    | `/info`                                         | App metadata                       | `{"app": "DevOps Trainer", "version": "1.0.0", ...}` |

## Local Setup

```bash
# Clone the repository
git clone https://github.com/<your-username>/devops-trainer.git
cd devops-trainer

# Create and activate a virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the application
python app.py
```

Open [http://localhost:5000](http://localhost:5000) in your browser.

## Docker Usage

```bash
# Build the image
docker build -t devops-trainer .

# Run the container
docker run -d -p 5000:5000 \
  -e APP_ENV=production \
  --name devops-trainer \
  devops-trainer
```

## Docker Compose Usage

```bash
# Start the service
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the service
docker-compose down
```

The Compose file sets `APP_ENV=production` and configures the container to restart unless stopped.

## DevOps Learning Goals

This project demonstrates several DevOps practices and patterns:

- **Containerization** — Dockerized Flask application using a lightweight Python base image and `.dockerignore` for cleaner builds
- **Orchestration** — Docker Compose for service definition, environment configuration, and restart policies
- **API Design** — RESTful endpoints for health checks and metadata, enabling integration with monitoring and service discovery tools
- **Readiness** — The `/health` and `/info` endpoints provide the foundation for container orchestration health probes
- **Environment parity** — Single codebase runs identically in development (local) and production (containerized)
- **Infrastructure as code** — All infrastructure definition lives in version-controlled files (`Dockerfile`, `docker-compose.yml`)

## Future Improvements

- Unit and integration tests (pytest)
- CI/CD pipeline (GitHub Actions for build, test, and deploy)
- Additional DevOps tool categories (Helm, Ansible, CI/CD tools)
- Multiplayer or timed leaderboard
- Difficulty levels with varying question pools
- Health check integration with Docker Compose `healthcheck`
