
-- ============================================================
-- CURO DATABASE SCHEMA
-- PostgreSQL
-- IDs use BIGINT/BIGSERIAL to match Java Long fields
-- ============================================================


-- ============================================================
-- USERS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- PROVIDERS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS providers (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    type VARCHAR(50) NOT NULL,
    speciality VARCHAR(255),
    license_number VARCHAR(255),
    description TEXT,
    address TEXT,
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    rating DOUBLE PRECISION DEFAULT 0,
    reviews_count INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- SLOTS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS slots (
    id BIGSERIAL PRIMARY KEY,
    provider_id BIGINT NOT NULL REFERENCES providers(id),
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    status VARCHAR(50) DEFAULT 'AVAILABLE',
    version INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- BOOKINGS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS bookings (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    slot_id BIGINT NOT NULL REFERENCES slots(id),
    provider_id BIGINT NOT NULL REFERENCES providers(id),
    status VARCHAR(50) DEFAULT 'PENDING_PAYMENT',
    idempotency_key VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- PAYMENTS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS payments (
    id BIGSERIAL PRIMARY KEY,
    booking_id BIGINT NOT NULL REFERENCES bookings(id),
    amount DECIMAL(10, 2),
    status VARCHAR(50) DEFAULT 'INITIATED',
    gateway_txn_id VARCHAR(255),
    idempotency_key VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- APPOINTMENTS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS appointments (
    id BIGSERIAL PRIMARY KEY,
    booking_id BIGINT NOT NULL REFERENCES bookings(id),
    status VARCHAR(50) DEFAULT 'SCHEDULED',
    consult_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- FOLLOWUPS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS followups (
    id BIGSERIAL PRIMARY KEY,
    appointment_id BIGINT NOT NULL REFERENCES appointments(id),
    next_visit_date TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- REVIEWS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS reviews (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    provider_id BIGINT NOT NULL REFERENCES providers(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_provider_email
    ON providers(email);

CREATE INDEX IF NOT EXISTS idx_provider_type
    ON providers(type);

CREATE INDEX IF NOT EXISTS idx_provider_speciality
    ON providers(speciality);

CREATE INDEX IF NOT EXISTS idx_provider_is_active
    ON providers(is_active);

CREATE INDEX IF NOT EXISTS idx_user_email
    ON users(email);

CREATE INDEX IF NOT EXISTS idx_slot_provider
    ON slots(provider_id);

CREATE INDEX IF NOT EXISTS idx_slot_status
    ON slots(status);

CREATE INDEX IF NOT EXISTS idx_booking_user
    ON bookings(user_id);

CREATE INDEX IF NOT EXISTS idx_booking_provider
    ON bookings(provider_id);

CREATE INDEX IF NOT EXISTS idx_booking_status
    ON bookings(status);

CREATE INDEX IF NOT EXISTS idx_payment_booking
    ON payments(booking_id);

CREATE INDEX IF NOT EXISTS idx_review_provider
    ON reviews(provider_id);


-- ============================================================
-- SAMPLE PROVIDER DATA
-- ============================================================



-- ============================================================
-- NOTE
-- ============================================================
-- Update password_hash values with actual BCrypt hashes
-- before using this in production.
--
-- Example:
-- new BCryptPasswordEncoder().encode("password")
-- ============================================================
