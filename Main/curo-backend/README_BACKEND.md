# Curo Phase 1 — Backend Setup & Run Guide

## Prerequisites

- Java 17 or higher
- Maven 3.8+
- PostgreSQL 13+
- Git

---

## Step 1: Database Setup

### 1.1 Create PostgreSQL User & Database

```bash
# Login to PostgreSQL
psql -U postgres

# Create database and user
CREATE USER curo_user WITH PASSWORD 'curo_password';
CREATE DATABASE curo_db OWNER curo_user;

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE curo_db TO curo_user;

# Exit psql
\q
```

### 1.2 Initialize Schema

```bash
# Connect to curo_db and run schema
psql -U curo_user -d curo_db -f schema.sql
```

---

## Step 2: Project Structure Setup

Create the following directory structure:

```
curo-backend/
├── pom.xml
└── src/
    └── main/
        ├── java/
        │   └── com/
        │       └── curo/
        │           ├── CuroApplication.java
        │           ├── config/
        │           │   └── SecurityConfig.java
        │           ├── user/
        │           │   ├── User.java
        │           │   ├── UserRepository.java
        │           │   ├── UserService.java
        │           │   ├── UserController.java
        │           │   └── dto/
        │           │       ├── AuthRequest.java
        │           │       └── AuthResponse.java
        │           ├── provider/
        │           │   ├── Provider.java
        │           │   ├── ProviderRepository.java
        │           │   ├── ProviderService.java
        │           │   └── ProviderController.java
        │           ├── availability/
        │           │   ├── Slot.java
        │           │   ├── SlotRepository.java
        │           │   ├── AvailabilityService.java
        │           │   ├── AvailabilityController.java
        │           │   └── dto/
        │           │       └── SlotRequest.java
        │           ├── booking/
        │           │   ├── Booking.java
        │           │   ├── BookingRepository.java
        │           │   ├── BookingService.java
        │           │   ├── BookingController.java
        │           │   └── dto/
        │           │       ├── BookingRequest.java
        │           │       └── BookingResponse.java
        │           ├── payment/
        │           │   ├── Payment.java
        │           │   ├── PaymentRepository.java
        │           │   ├── PaymentService.java
        │           │   ├── PaymentController.java
        │           │   └── dto/
        │           │       └── PaymentResponse.java
        │           ├── appointment/
        │           │   ├── Appointment.java
        │           │   └── AppointmentRepository.java
        │           ├── followup/
        │           │   ├── Followup.java
        │           │   └── FollowupRepository.java
        │           ├── review/
        │           │   ├── Review.java
        │           │   └── ReviewRepository.java
        │           ├── exception/
        │           │   └── GlobalExceptionHandler.java
        │           └── util/
        │               └── JwtUtil.java
        └── resources/
            └── application.yml
```

---

## Step 3: Copy Files

Copy all the `.java` files to their respective locations in the project structure above.
Copy `pom.xml` to the project root.
Copy `application.yml` to `src/main/resources/`.
Copy `schema.sql` to `src/main/resources/` (optional; schema already created).

---

## Step 4: Build & Run

### 4.1 Build with Maven

```bash
cd curo-backend
mvn clean install -DskipTests
```

### 4.2 Run the Application

```bash
mvn spring-boot:run
```

Or build and run directly:

```bash
mvn clean package -DskipTests
java -jar target/curo-backend-0.1.0-SNAPSHOT.jar
```

The backend should start on `http://localhost:8080/api`

---

## Step 5: Test the Endpoints

### 5.1 Signup

```bash
curl -X POST http://localhost:8080/api/users/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "userId": 1,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "email": "john@example.com"
}
```

### 5.2 Login

```bash
curl -X POST http://localhost:8080/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 5.3 Create a Provider

```bash
curl -X POST http://localhost:8080/api/providers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. Smith Clinic",
    "type": "DOCTOR",
    "speciality": "Cardiology",
    "lat": 28.6139,
    "lng": 77.2090
  }'
```

**Response:**
```json
{
  "id": 1,
  "name": "Dr. Smith Clinic",
  "type": "DOCTOR",
  "speciality": "Cardiology",
  "lat": 28.6139,
  "lng": 77.2090,
  "rating": 0.0,
  "reviewsCount": 0,
  "createdAt": "2024-01-15T10:30:00"
}
```

### 5.4 Get Providers

```bash
curl http://localhost:8080/api/providers
```

### 5.5 Create Slots for a Provider

```bash
curl -X POST http://localhost:8080/api/providers/1/slots \
  -H "Content-Type: application/json" \
  -d '{
    "startTime": "2024-01-20T09:00:00",
    "endTime": "2024-01-20T09:30:00"
  }'
```

### 5.6 Get Available Slots

```bash
curl 'http://localhost:8080/api/providers/1/slots?from=2024-01-20T00:00:00&to=2024-01-25T23:59:59'
```

### 5.7 Create a Booking (Requires Auth)

```bash
curl -X POST http://localhost:8080/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "slotId": 1,
    "idempotencyKey": "unique-key-123"
  }'
```

**Response:**
```json
{
  "bookingId": 1,
  "status": "PENDING_PAYMENT",
  "paymentUrl": "http://localhost:8080/api/payments/mock-success/1"
}
```

### 5.8 Confirm Payment (Mock)

```bash
curl -X POST http://localhost:8080/api/payments/mock-success/1
```

**Response:**
```
Payment confirmed and booking status updated
```

### 5.9 Check Booking Status

```bash
curl http://localhost:8080/api/bookings/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running: `sudo systemctl start postgresql`
- Verify credentials in `application.yml`
- Check if database `curo_db` exists

### Port Already in Use
```bash
# Kill process on port 8080
lsof -i :8080
kill -9 <PID>
```

### Maven Build Fails
```bash
# Clear Maven cache
rm -rf ~/.m2/repository
mvn clean install -DskipTests
```

---

## Phase 1 Testing Checklist

- [ ] Database initialized with schema
- [ ] Backend starts on port 8080
- [ ] User signup works
- [ ] User login returns JWT token
- [ ] Provider creation works
- [ ] Slot creation works
- [ ] Booking creation locks slot (optimistic locking)
- [ ] Payment mock endpoints work
- [ ] Booking status updates on payment confirmation
- [ ] Concurrent booking attempts fail for same slot (no double-booking)

---

## Next Steps

- **Phase 2:** Split into microservices (separate services for Booking, Payment, Notification)
- **Phase 3:** Add Redis caching for availability reads
- **Phase 4:** Add Elasticsearch for full-text search on providers
- **Phase 5:** Deploy with Docker & Kubernetes

---

## Environment Variables (Optional)

Set these for production:

```bash
export JWT_SECRET="your-production-secret-key"
export DB_URL="jdbc:postgresql://prod-db:5432/curo_db"
export DB_USER="curo_user"
export DB_PASSWORD="secure-password"
```

Then reference in `application.yml`:
```yaml
spring:
  datasource:
    url: ${DB_URL}
    username: ${DB_USER}
    password: ${DB_PASSWORD}
jwt:
  secret: ${JWT_SECRET}
```
