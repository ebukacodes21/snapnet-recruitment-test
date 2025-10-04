# Snap Recruitment Test

This is a Node.js/TypeScript service for a Workforce Management System, designed with scalability, clean architecture, and maintainability in mind.

It includes:

- RESTful API endpoints for departments, employees, and leave requests  
- Input validation using Zod  
- RabbitMQ integration with dead-letter exchange (DLX) support  
- Redis-based caching for employee lookups  
- Role-based access control  
- Unit and integration tests using Jest and Supertest  

---

## Tech Stack

- Node.js (v16+)
- Express.js
- TypeScript
- MySQL (via Sequelize ORM)
- RabbitMQ (via amqplib)
- Redis
- Zod (schema validation)
- Jest + Supertest (testing)
- express-rate-limit (API throttling)

---

## Features

### Core Functionality

- Departments: Create department, retrieve department with employees (pagination enabled)
- Employees: Create employee under a department, retrieve employee with leave history
- Leave Requests: Submit leave request, save to database and publish to queue. 
- Message Queue: RabbitMQ producer/consumer for processing business logic (e.g leave processing) 
- Caching: Redis-based employee caching for performance  
- Access Control: Basic role-based access control (Admin vs Employee)

### Architectural Patterns

- Repository Pattern (abstracts DB operations)  
- Service Layer (business logic)  
- Strategy Pattern (for retry policies)  
- Response Wrapper (for consistent API responses)

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/ebukacodes21/snap-recruitment-test.git
cd snap-recruitment-test

2. Install Dependencies
npm install

3. Configure Environment Variables

Create a .env file in the root directory with the following content:

PORT=8000

# MySQL
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_NAME=snapnet_db
DATABASE_USER=snapnet_user
DATABASE_PASSWORD=snapnet_password

# RabbitMQ
MESSAGE_BROKER_USER=guest
MESSAGE_BROKER_PASSWORD=guest
MESSAGE_BROKER_URL=amqp://guest:guest@localhost:5672
EXCHANGE_NAME=SNAPNET
LEAVE_BINDING_KEY=LEAVE_BINDING_KEY
LEAVE_QUEUE_NAME=LEAVE_QUEUE

# Redis
REDIS_URL=redis://localhost:6379

Running the Application
Option 1: Run Entire Stack with Docker

Recommended approach. This launches the App, MySQL, RabbitMQ, and Redis together. Uncomment the app section in the compose file

docker-compose up --build

Option 2: Run Locally, Connect to Dockerized Services
docker-compose up -d mysql redis rabbitmq
npm run dev

Database & Migrations

Managed with Sequelize and Umzug
Indexed on employee email and departmentId
Migrations run automatically on startup

RabbitMQ Integration
Leave requests are published to a queue
Worker applies business rules:
Auto-approve ≤ 2 days
Set to pending_approval otherwise
Implements retry mechanism via strategy pattern
Supports idempotency
Dead-letter queue for unprocessed messages

Testing
Unit tests for core business logic
Integration tests using Supertest
Queue logic tested with mocked RabbitMQ
Run tests with:
npm test

API Overview
Method	Endpoint	                    Description
POST	/departments	                Create a department
GET	/departments/:id/employees	        List employees in a department
POST	/employees	                    Create an employee
GET	/employees/:id	                    Get an employee and their leave history
POST	/leave-requests	                Submit a leave request (queued)