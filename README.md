# Professional Full Stack Authentication System
Professional authentication system built with Spring Boot, React,Typescript and jwt authentication.


**Features:**
- JWT Authentication
- Email Verification
- Secure HTTP-only Cookie
- Role-Based Authorization

## Tech Stack
### Backend:
- Java 21
- Spring Boot
- Spring Security
- JWT 
- PostgreSQL
- Maven
- Docker
- Redis
- RabbitMQ


## Project Structure
```markdown
authorization
|
|──backend
|   |──src/
|       |──config/
|       |──constant/
|       |──controller/
|       |──dto/
|       |──entity/
|       |──exception/
|       |──producer/
|       |──repository/
|       |──service/
|       |──util/
|   |──pom.xml
|   |──Dockerfile
|
└── docker-compose.yml
```


## Authentication Flow
1. User login in with email and password
2. Backend validates credentials
3. Access token is returned
4. Refresh token stored in HTTP-only cookie

## Environment Variables
#### Backend
```dotenv
PORT=
DB_NAME=
DB_HOST=
DB_PORT=
DB_USER=
DB_PASS=
JWT_SECRET=
JWT_ACCESS_TIME=
JWT_REFRESH_TIME=
SMTP_USER=
SMTP_PASS=
```
#### Frontend
```dotenv
VITE_API_URL=http://your_host:your_port/api/v1
```
## Installation

#### Backend:
```text
cd backend
mvn clean install
mvn spring-boot:run
```
#### Docker
```text
docker compose up --build
```