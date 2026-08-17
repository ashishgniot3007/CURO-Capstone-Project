# 🩺 CURO — Smart Doctor–Patient Management Platform

<p align="center">
  <strong>Healthcare, simplified. Appointments, queues & medical records — all in one place.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Java-Backend-orange?style=for-the-badge&logo=openjdk" />
  <img src="https://img.shields.io/badge/Spring%20Boot-Microservices-brightgreen?style=for-the-badge&logo=springboot" />
  <img src="https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/Kafka-Event%20Streaming-black?style=for-the-badge&logo=apachekafka" />
  <img src="https://img.shields.io/badge/PostgreSQL-Database-336791?style=for-the-badge&logo=postgresql" />
  <img src="https://img.shields.io/badge/Redis-Cache-DC382D?style=for-the-badge&logo=redis" />
</p>

<p align="center">
  <a href="#-about-curo">About</a> •
  <a href="#-features">Features</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-modules">Modules</a> •
  <a href="#-getting-started">Getting Started</a>
</p>

---

## 🌐 About CURO

**CURO** is a modern **Doctor–Patient Management Platform** designed to bring the complete healthcare appointment lifecycle into one unified system.

Unlike conventional appointment platforms that mainly focus on booking, CURO connects:

> **Doctor Discovery → Appointment Booking → Live Queue → Consultation → Digital Records → Prescription → Payment → Follow-up**

The platform supports both **online and offline appointments**, while providing patients with real-time visibility into their position in an in-clinic queue.

### 🎯 The Problem

Traditional healthcare visits often involve:

* ⏳ Unpredictable waiting times
* 🏥 Overcrowded clinics
* 📅 Appointment scheduling conflicts
* 📄 Scattered medical records
* 💳 Separate payment workflows
* 🔔 Missed appointment reminders
* 🔄 Poor communication between patients and doctors

### 💡 The CURO Approach

CURO brings these processes together into a single digital ecosystem.

**Book → Track → Consult → Record → Follow Up**

---

# ✨ Key Features

## 👤 Patient Experience

* 🔐 Secure registration and login
* 🔎 Search doctors and hospitals
* 🩺 Filter providers by speciality, location, rating and availability
* 📅 Online appointment booking
* 🏥 Offline/in-clinic appointment booking
* 🎫 Real-time queue position
* ⏱️ Estimated waiting time
* 📋 Appointment history
* 💊 Digital prescriptions
* 📄 Electronic Health Records (EHR)
* 💳 Online payments
* 🔔 Appointment and queue notifications
* ⭐ Consultation ratings and reviews
* 🔄 Follow-up appointment scheduling

---

## 👨‍⚕️ Doctor Dashboard

Doctors get a dedicated workspace to manage their complete consultation workflow.

### Doctor capabilities

* 📅 Manage availability and schedules
* 📥 Accept/reject appointment requests
* 👥 View assigned patients
* 📋 Access patient medical history
* 💊 Create digital prescriptions
* 🧪 Recommend laboratory tests
* 🔄 Schedule follow-ups
* 📊 Monitor daily patient flow
* 🟢 Update consultation status
* 🏥 Manage online and offline consultations

---

## 🛡️ Admin Dashboard

The administrator manages the entire platform.

### Admin capabilities

* 👤 Manage patients
* 👨‍⚕️ Manage doctors
* 🏥 Manage hospitals and clinics
* ✅ Verify doctor registrations
* 🗂️ Manage departments and specialities
* 📅 Monitor appointments
* 💳 Monitor payments
* 📊 Generate reports and analytics
* 🎫 Monitor queue activity
* 📨 Handle complaints and support requests

---

# 🚀 CURO's Unique Feature

## 🎫 Real-Time Queue Tracking

One of CURO's major differentiators is its **live in-clinic queue system**.

Instead of simply showing:

> **"Appointment at 4:00 PM"**

CURO aims to provide:

```text
Doctor: Dr. Sharma
Appointment: 4:00 PM

┌─────────────────────────────┐
│      LIVE QUEUE STATUS      │
├─────────────────────────────┤
│ Your Position       #4      │
│ Patients Ahead      3       │
│ Estimated Wait      25 min  │
│ Current Patient     #1      │
│ Status              🟢 Live │
└─────────────────────────────┘
```

This helps patients plan their time instead of spending unnecessary hours waiting inside a clinic.

---

# 🏗️ System Architecture

CURO follows a **microservices-based architecture** designed for scalability, independent deployment and fault isolation.

```text
                    ┌───────────────────────┐
                    │      Web Client       │
                    │       React.js        │
                    └───────────┬───────────┘
                                │
                    ┌───────────▼───────────┐
                    │      API Gateway      │
                    │ Spring Cloud Gateway  │
                    │ JWT + Rate Limiting    │
                    └───────────┬───────────┘
                                │
        ┌───────────────────────┼────────────────────────┐
        │                       │                        │
        ▼                       ▼                        ▼
 ┌─────────────┐        ┌─────────────┐        ┌─────────────┐
 │    User     │        │  Provider   │        │ Availability│
 │  Service    │        │   Service   │        │   Service   │
 └──────┬──────┘        └──────┬──────┘        └──────┬──────┘
        │                       │                        │
        └───────────────────────┼────────────────────────┘
                                │
        ┌───────────────────────▼────────────────────────┐
        │              Booking Service                   │
        └───────────────────────┬────────────────────────┘
                                │
                 ┌──────────────┴──────────────┐
                 ▼                             ▼
        ┌────────────────┐             ┌────────────────┐
        │ Payment Service│             │ Search Service │
        └───────┬────────┘             └───────┬────────┘
                │                              │
                └──────────────┬───────────────┘
                               ▼
                    ┌─────────────────────┐
                    │   Apache Kafka      │
                    │    Event Bus        │
                    └─────────┬───────────┘
                              │
                    ┌─────────▼───────────┐
                    │ Notification Service│
                    └─────────────────────┘

        ┌────────────────────────────────────────────┐
        │                 DATA LAYER                 │
        │                                            │
        │ PostgreSQL │ Redis │ Elasticsearch         │
        └────────────────────────────────────────────┘
```

---

# 🧩 Microservices

| Service                     | Responsibility                                |
| --------------------------- | --------------------------------------------- |
| 👤 **User Service**         | Registration, authentication, profiles & RBAC |
| 🏥 **Provider Service**     | Doctors, hospitals & specialities             |
| 🕐 **Availability Service** | Slots, queue position & consultation status   |
| 📅 **Booking Service**      | Booking, cancellation & rescheduling          |
| 💳 **Payment Service**      | Consultation payment processing               |
| 🔎 **Search Service**       | Doctor/hospital discovery                     |
| 🔔 **Notification Service** | Appointment, payment & reminder notifications |
| 🚪 **API Gateway**          | Routing, authentication & rate limiting       |

---

# 🛠️ Tech Stack

### Backend

```text
Java
Spring Boot
Spring Cloud Gateway
Spring REST APIs
JWT Authentication
Role-Based Access Control
```

### Frontend

```text
React
Web Application
Android
iOS
```

### Database & Storage

```text
PostgreSQL
Redis
Elasticsearch
```

### Distributed Systems

```text
Apache Kafka
Microservices Architecture
Event-Driven Communication
```

### DevOps & Deployment

```text
Docker
Kubernetes
Cloud Infrastructure
```

---

# 🔐 Security

Security is a core part of CURO because the platform handles sensitive healthcare information.

### Security mechanisms

* 🔑 JWT-based authentication
* 🛡️ Role-Based Access Control
* 👤 Patient / Doctor / Admin authorization
* 🔒 Secure password storage
* 🗃️ Protected medical records
* 💳 Secure payment integration
* 🚫 Restricted access to patient records
* 🔐 Encrypted sensitive information

---

# 🔄 Appointment Workflow

```text
Patient
   │
   ▼
Search Doctor / Hospital
   │
   ▼
View Provider Details
   │
   ▼
Select Online / Offline
   │
   ▼
Choose Available Slot
   │
   ▼
Payment
   │
   ▼
Booking Confirmed
   │
   ├──────────────► Online Consultation
   │
   ▼
Offline Appointment
   │
   ▼
Live Queue Tracking
   │
   ▼
Consultation
   │
   ▼
Digital Prescription
   │
   ▼
Medical Record Updated
   │
   ▼
Follow-up Appointment
```

---

# 📊 Core Entities

```text
User
 ├── Patient
 ├── Doctor
 └── Admin

Provider
 ├── Doctor
 └── Hospital

Available Slot
Appointment
Booking
Payment
Prescription
Medical Record
Follow-up
Notification
```

### Key Relationships

```text
Patient ────────► Bookings
Provider ───────► Available Slots
Booking ────────► Appointment
Booking ────────► Payment
Appointment ────► Follow-up
User ───────────► Notifications
```

---

# 📈 Scalability

CURO is designed with scalability in mind.

The architecture targets approximately:

```text
👥 10,000 concurrent users
📦 ~50 bookings/minute
⚡ 2–3 second normal response target
🔄 Independently scalable microservices
```

Services can be scaled independently depending on traffic.

For example:

```text
High Booking Traffic
        │
        ▼
  Booking Service
        │
        ├── Scale Instance 1
        ├── Scale Instance 2
        └── Scale Instance 3
```

This avoids scaling the entire application when only one service experiences high traffic.

---

# ⚡ Event-Driven Architecture

CURO uses **Apache Kafka** for asynchronous communication between services.

Example:

```text
Patient Books Appointment
          │
          ▼
    Booking Service
          │
          ▼
      Kafka Event
          │
    ┌─────┼──────────────┐
    ▼     ▼              ▼
 Payment  Queue      Notification
 Service  Service      Service
```

This reduces coupling between services and allows asynchronous processing of events such as:

* Appointment creation
* Payment confirmation
* Appointment reminders
* Queue updates
* Notification delivery

---

# 📁 Project Structure

```text
CURO/
│
├── api-gateway/
│
├── user-service/
│
├── provider-service/
│
├── availability-service/
│
├── booking-service/
│
├── payment-service/
│
├── search-service/
│
├── notification-service/
│
├── curo-frontend/
│
├── docker/
│
├── docs/
│
└── README.md
```

---

# ⚙️ Getting Started

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/<your-username>/CURO.git

cd CURO
```

## 2️⃣ Configure Environment

Create the required environment/configuration files for:

```text
PostgreSQL
Redis
Elasticsearch
Kafka
JWT
Payment Gateway
Notification Provider
```

## 3️⃣ Start Infrastructure

If using Docker:

```bash
docker compose up -d
```

## 4️⃣ Run Backend Services

Start the Spring Boot microservices individually:

```bash
cd user-service
./mvnw spring-boot:run
```

Repeat for the remaining services.

## 5️⃣ Start Frontend

```bash
cd curo-frontend
npm install
npm run dev
```

---

# 🧪 Testing

The project is intended to validate:

* Authentication
* Role-based authorization
* Doctor search
* Appointment booking
* Slot availability
* Queue tracking
* Payment workflow
* Prescription management
* Medical record access
* Notifications
* Service-to-service communication

---

# 🗺️ Roadmap

### Phase 1 — Foundation

* [x] Project architecture
* [x] Requirement analysis
* [x] Microservice design
* [x] Database design

### Phase 2 — Core Platform

* [ ] Authentication
* [ ] Patient module
* [ ] Doctor module
* [ ] Admin module
* [ ] Provider management

### Phase 3 — Healthcare Workflow

* [ ] Appointment booking
* [ ] Offline appointment queue
* [ ] Real-time queue tracking
* [ ] Digital prescriptions
* [ ] Medical records

### Phase 4 — Distributed Services

* [ ] Kafka integration
* [ ] Redis caching
* [ ] Elasticsearch search
* [ ] Notification service
* [ ] Payment integration

### Phase 5 — Deployment

* [ ] Docker
* [ ] Cloud deployment
* [ ] Monitoring
* [ ] Performance testing

---

# 🔮 Future Enhancements

CURO can be extended with:

* 🤖 AI-assisted symptom triage
* 📹 Secure video consultations
* 🌐 Multilingual healthcare support
* 💊 Online pharmacy integration
* 🏥 Laboratory integration
* ❤️ Wearable device integration
* 📊 Predictive hospital analytics
* 🚑 Emergency hospital/ambulance assistance
* ☁️ Automated cloud backup & disaster recovery

---

# 🎓 Project Information

| Category           | Details             |
| ------------------ | ------------------- |
| **Project**        | CURO                |
| **Domain**         | HealthTech          |
| **Architecture**   | Microservices       |
| **Backend**        | Java + Spring Boot  |
| **Frontend**       | React               |
| **Database**       | PostgreSQL          |
| **Cache**          | Redis               |
| **Search**         | Elasticsearch       |
| **Messaging**      | Apache Kafka        |
| **Authentication** | JWT + RBAC          |
| **Deployment**     | Docker / Kubernetes |
| **Project Type**   | Capstone Project    |

---

# 🌟 Why CURO?

> **CURO isn't just an appointment booking system.**
>
> It is designed as a complete healthcare interaction platform connecting **patients, doctors and healthcare providers** through booking, live queues, consultations, payments and digital medical records.

### One platform.

### One healthcare journey.

### Less waiting. More care. ❤️

---

## 👨‍💻 Contributors

Built with ❤️ by the CURO development team.

**Developers:**
`<Your Name>`
`<Team Member>`
`<Team Member>`

---

## 📄 Documentation

Detailed project documentation includes:

* Software Requirements Specification
* High-Level Design
* System Architecture
* Database Design
* API Documentation
* Use Cases
* Testing Documentation

---

## ⭐ Support the Project

If you find **CURO** interesting, consider giving the repository a ⭐.

It helps support the project and motivates further development.

---

<p align="center">
  <strong>CURO — Making Healthcare Smarter, Faster & More Connected.</strong>
</p>
