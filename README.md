# Intelligent Defect Management Platform (IDMP)

---

## 1. Project Overview

The Intelligent Defect Management Platform (IDMP) is an AI-powered software system designed to support the complete defect lifecycle in software development projects. The platform enables efficient defect reporting, automated severity classification, duplicate detection, maintenance analytics, and risk assessment to improve software quality and project reliability.

Traditional defect tracking systems rely heavily on manual processes, which often lead to misclassification, delayed resolution, duplicate work, and lack of visibility into long-term software health. IDMP addresses these issues by introducing intelligence, automation, and data-driven insights into defect management.

---

## 2. Problem Statement

In modern software projects:
- Defects are manually classified, leading to inconsistent prioritization
- Duplicate bugs waste development effort
- Maintenance metrics are rarely tracked effectively
- Project risk is not quantified objectively
- Managers lack real-time visibility into system health

The Intelligent Defect Management Platform aims to solve these problems by using AI-based analysis, historical defect intelligence, and risk scoring mechanisms.

---

## 3. Vision Statement

To build an intelligent, automated, and insight-driven defect management platform that reduces defect resolution time, avoids redundant effort, improves software quality, and provides clear visibility into project risk and stability.

---

## 4. Stakeholders & Personas

### 4.1 Software Tester
- Reports defects with detailed context
- Expects quick routing and acknowledgement
- Wants reduced duplicate reporting

### 4.2 Developer
- Receives correctly prioritized defects
- Avoids fixing duplicate issues
- Tracks defect resolution progress

### 4.3 QA Lead
- Analyzes defect trends and recurrence
- Evaluates fix quality and stability

### 4.4 Project Manager
- Monitors project health using metrics
- Reviews overall risk score
- Makes informed planning decisions

### 4.5 System Administrator
- Manages users, teams, and access control

---

## 5. Goals and Objectives

- Automate defect severity classification using AI
- Detect duplicate or similar defects using historical data
- Reduce Mean Time to Resolve (MTTR)
- Track defect recurrence and fix quality
- Quantify defect and project-level risk
- Improve decision-making using analytics dashboards

---

## 6. Key Features

- Bug reporting with detailed metadata
- AI-based severity classification
- Automatic team assignment
- Email notifications for assigned defects
- Historical defect repository
- Duplicate and similarity detection
- Maintenance metrics (MTTR, recurrence interval)
- Risk assessment (short-term and long-term)
- Defect-level and project-level risk scoring
- Analytics and dashboards

---

## 7. Success Metrics

- Reduction in Mean Time to Resolve (MTTR)
- Decrease in duplicate defect reports
- Improved defect resolution accuracy
- Increased system stability over time
- Higher team productivity

---

## 8. Assumptions & Constraints

### Assumptions

- Users provide meaningful defect descriptions
- Historical defect data is available for comparison

### Constraints

- AI accuracy depends on training data quality
- Limited to text-based defect analysis initially
- Free-tier cloud and tooling usage

---

## 9. User Stories

This project is driven by 25 user stories covering:
- Defect reporting
- AI classification and assignment
- Duplicate detection
- Developer workflows
- Maintenance metrics
- Risk assessment
- Analytics and administration

📌 All user stories are maintained as GitHub Issues in this repository.

---

## 10. MoSCoW Prioritization

### Must Have
- Defect reporting
- Severity classification
- Team assignment
- Historical defect storage
- Notifications

### Should Have
- Duplicate detection
- Maintenance metrics (MTTR)
- Risk scoring
- Analytics dashboard

### Could Have
- Exportable reports
- Advanced trend analysis
- AI improvement suggestions

### Won’t Have (for this version)
- Mobile application
- Voice-based input
- Automatic code fixing

---

## 11. System Architecture

The system follows a modular, service-oriented architecture:

- Frontend: User interface for defect reporting and dashboards
- Backend API: Handles business logic and workflows
- AI Service: Performs NLP-based defect classification
- Database: Stores defect data and metrics
- Notification Service: Sends automated alerts
- Docker: Containerized deployment


---

## 12. Software Design

The Intelligent Defect Management Platform follows a modular layered architecture with a FastAPI backend and a dedicated AI microservice for semantic classification and FAISS-based duplicate detection. The design emphasizes high cohesion, low coupling, and scalability to support efficient defect lifecycle management and data-driven risk analytics.

<img width="940" height="678" alt="image" src="https://github.com/user-attachments/assets/878dd323-b9b4-4303-acf8-1c69e621788c" />

Figma Design -> https://www.figma.com/design/IXdmfqNLv2ylYNoCoyWolD/Intelligent-DefectManagement?node-id=0-1&t=wdMiukfMCuQwejun-1

---

## 13. Technology Stack

### Frontend
- React.js
- Tailwind

### Backend
- Python and FastAPI
- REST APIs

### AI / ML
- NLP-based text classification
- Similarity matching algorithms

### Database
- PostgreSQL / MongoDB

### DevOps
- Docker
- Docker Compose
- GitHub

---

## 14. GitHub Workflow & Branching Strategy

This project follows **GitHub Flow**:

- `main` branch contains stable code
- Feature development is done on `feature/*` branches
- Eg. feature/bug-report, feature/bug-report
- Pull requests are used for merging

---

## 15. Docker & Local Setup

### Prerequisites
- Docker Desktop installed
- Git installed

### Steps to Run Locally
```bash
git clone https://github.com/vansh-9878/Intelligent-Defect-Management
cd Intelligent-Defect-Management
docker-compose up --build
```
The application will be accessible on http://localhost:8080.

---
