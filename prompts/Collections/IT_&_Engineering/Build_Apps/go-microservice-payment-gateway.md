---
title: "Go Microservice Payment Gateway"
tags: ["it", "build-apps", "microservice", "payment", "gateway"]
category: "IT"
subcategory: "Build_Apps"
---
# Go Microservice Payment Gateway

Build a scalable, high-performance Payment Gateway microservice using Go (Golang) designed to process transactions across multiple third-party providers (e.g., Stripe, PayPal).

---

## Role & Context

You are a senior backend engineer specializing in Go and distributed systems, tasked with building a resilient financial transaction service.

**Tech Stack (Fixed):**
- **Backend:** Go (Golang) 1.21+
- **API Framework:** Gin or Echo
- **Database:** CockroachDB or PostgreSQL (for ACID compliance)
- **Message Broker:** Apache Kafka or RabbitMQ
- **Deployment:** Kubernetes (Helm charts), Docker

---

## Product Requirements

### Core Features

#### 1) Transaction Processing
Handle inbound payment requests securely.
- Authorize, Capture, Void, and Refund operations.
- Dynamic routing to payment providers (Stripe, PayPal, Adyen) based on rules (currency, region).
- Generate universal transaction IDs for downstream tracking.

#### 2) Webhooks & Callbacks
Receive asynchronous updates.
- Ingest webhooks from providers (e.g., payment succeeded, dispute opened).
- Publish events to a message broker for other internal microservices.

#### 3) Idempotency & Retries
Ensure data integrity in a distributed environment.
- Enforce idempotent requests using an `Idempotency-Key` header.
- Implement exponential backoff for failed upstream provider calls.

---

## Technical Requirements

### Architecture
A stateless microservice architecture designed for horizontal scaling. The service exposes RESTful or gRPC endpoints, persists state to a relational database, and communicates asynchronously via an event-driven message broker.

### Data Model
- **Transaction:** ID, ProviderTransactionID, Status (Pending, Succeeded, Failed, Refunded), Amount, Currency, PaymentMethod, CreatedAt
- **IdempotencyLog:** Key, RequestPayload, ResponsePayload, Status, Expiry
- **MerchantConfig:** MerchantID, ProviderKeys (Encrypted), RoutingRules

### API Design
- `POST /v1/payments/authorize` - Reserve funds.
- `POST /v1/payments/{id}/capture` - Settle funds.
- `POST /v1/payments/{id}/refund` - Return funds.
- `POST /webhooks/{provider}` - Handle external provider events.

### Security Requirements
- Mutual TLS (mTLS) for internal service communication.
- API keys or OAuth2 machine-to-machine authentication.
- All sensitive data (PANs, API keys) must be encrypted at rest using a KMS.
- PCI-DSS compliance considerations (no storing of raw credit card numbers).

### Performance Requirements
- Handle up to 5,000 transactions per second (TPS).
- 99th percentile latency under 50ms for internal processing (excluding external provider latency).

---

## Implementation Details

### Go Project Structure
Follow standard Go layout:
- `cmd/payment-gateway/main.go` - Entry point.
- `internal/api` - HTTP handlers and routing.
- `internal/core` - Business logic (routing, state machine).
- `internal/providers` - Adapters for Stripe, PayPal, etc.
- `internal/repository` - Database access.

### Idempotency Pattern
Implement middleware that checks Redis or PostgreSQL for an `Idempotency-Key`.
- If a request is in progress, return HTTP 409 Conflict.
- If a request completed, return the cached HTTP response.
- If it's a new request, process and save the result.

---

## UI/UX Requirements

### Key Pages/Views
- No UI required for this microservice. Output is purely JSON APIs and logs.

### Design Principles
- Developer-friendly API design (OpenAPI specs).
- Predictable and standardized JSON error responses (RFC 7807).

---

## Testing & Validation

### Unit Tests
- Extensive testing of the core state machine using Go's `testing` package.
- Mock external provider responses.

### Integration Tests
- Use Testcontainers to spin up PostgreSQL and Kafka for testing database and message publishing.

### E2E Tests
- Load testing using k6 or Locust simulating high TPS traffic.

---

## Deployment & Operations

### Environment Setup
- Manage configurations using environment variables or a remote config store (Consul/etcd).
- Database migrations handled automatically via tools like `golang-migrate`.

### Deployment Steps
1. Build a distroless Docker image.
2. Deploy via Kubernetes manifests (Deployment, Service, HPA, ConfigMap).
3. Set resource limits (CPU/Memory requests).

### Monitoring & Logging
- Export metrics in Prometheus format (latency, error rates, queue depth).
- Distributed tracing using OpenTelemetry (Jaeger/Zipkin).
- Structured JSON logging (e.g., using `slog` or `zap`).

---

## Documentation Requirements

Generate:
- [ ] README.md with local run instructions (Docker Compose)
- [ ] OpenAPI 3.0 YAML specification
- [ ] High-level architecture and sequence diagrams (Mermaid format)
- [ ] Runbook for handling failed transactions

---

## Constraints & Limitations

- The service must never lose a transaction. Strict ACID compliance required.
- Third-party provider integrations must be isolated so one failure doesn't cascade.
- Maximum request payload size: 1MB.

---

## Success Criteria

The project is complete when:
- [ ] A transaction can be successfully authorized and captured.
- [ ] The service correctly handles a webhook from a mocked provider.
- [ ] Idempotency prevents duplicate charges for the same request key.
- [ ] The service scales horizontally under load.
- [ ] All tests, including load tests, pass within latency thresholds.

---

## Tags

`#project` `#golang` `#microservice` `#backend` `#payments` `#build` `#api`

---

**Version:** 1.0 | **Created:** 2024-03-05 | **Updated:** 2024-03-05