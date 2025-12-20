# 🏗️ Deployment Architecture

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                          Production Deployment                        │
└─────────────────────────────────────────────────────────────────────┘

                              ┌──────────────┐
                              │   Internet   │
                              └──────┬───────┘
                                     │
                              ┌──────▼───────┐
                              │ Nginx/Apache │
                              │ Reverse Proxy│
                              │  SSL/TLS     │
                              └──────┬───────┘
                                     │
           ┌─────────────────────────┼─────────────────────────┐
           │                         │                         │
    ┌──────▼──────┐          ┌──────▼──────┐          ┌──────▼──────┐
    │  Frontend   │          │   Backend   │          │  Database   │
    │   (Nginx)   │◄────────►│(Spring Boot)│◄────────►│   (MySQL)   │
    │  Port: 80   │   API    │ Port: 8081  │   JDBC   │ Port: 3306  │
    └─────────────┘          └─────────────┘          └─────────────┘
         React                    Java 17                 MySQL 8.0
         Material-UI              JWT Auth                Persistent
                                  REST API                Storage

```

## Docker Container Architecture

```
┌───────────────────────────────────────────────────────────────────┐
│                     Docker Host System                             │
│                                                                    │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │              Docker Network: coffee-shop-network            │ │
│  │                                                             │ │
│  │  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐ │ │
│  │  │  Container   │    │  Container   │    │  Container   │ │ │
│  │  │  Frontend    │    │   Backend    │    │  Database    │ │ │
│  │  ├──────────────┤    ├──────────────┤    ├──────────────┤ │ │
│  │  │ nginx:alpine │    │ temurin:17   │    │ mysql:8.0    │ │ │
│  │  │              │    │              │    │              │ │ │
│  │  │ React Build  │───►│ Spring Boot  │───►│ MySQL DB     │ │ │
│  │  │              │HTTP│              │JDBC│              │ │ │
│  │  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘ │ │
│  │         │                   │                    │         │ │
│  └─────────┼───────────────────┼────────────────────┼─────────┘ │
│            │                   │                    │            │
│       Port 80               Port 8081            Port 3306       │
└────────────┼───────────────────┼────────────────────┼───────────┘
             │                   │                    │
        ┌────▼────┐         ┌────▼────┐         ┌────▼────┐
        │ Volume  │         │  Logs   │         │ Volume  │
        │  nginx  │         │  Files  │         │  mysql  │
        └─────────┘         └─────────┘         └─────────┘
```

## Multi-Stage Docker Build Process

### Backend Build (Spring Boot)

```
┌─────────────────────────────────────────────────┐
│         Stage 1: Builder                        │
│  Base: maven:3.9.5-eclipse-temurin-17          │
├─────────────────────────────────────────────────┤
│  1. Copy pom.xml                                │
│  2. Download dependencies (cached)              │
│  3. Copy source code                            │
│  4. Build JAR with Maven                        │
│  Result: /app/target/*.jar                      │
└─────────────────┬───────────────────────────────┘
                  │
                  │ Copy JAR only
                  ▼
┌─────────────────────────────────────────────────┐
│         Stage 2: Runtime                        │
│  Base: eclipse-temurin:17-jre-alpine           │
├─────────────────────────────────────────────────┤
│  1. Install wget for health checks              │
│  2. Create non-root user                        │
│  3. Copy JAR from builder                       │
│  4. Configure health check                      │
│  Result: Optimized image ~200MB                 │
└─────────────────────────────────────────────────┘
```

### Frontend Build (React)

```
┌─────────────────────────────────────────────────┐
│         Stage 1: Builder                        │
│  Base: node:18-alpine                           │
├─────────────────────────────────────────────────┤
│  1. Copy package.json & package-lock.json       │
│  2. Install dependencies with npm ci            │
│  3. Copy source code                            │
│  4. Build production bundle                     │
│  Result: /app/build (static files)              │
└─────────────────┬───────────────────────────────┘
                  │
                  │ Copy build folder only
                  ▼
┌─────────────────────────────────────────────────┐
│         Stage 2: Web Server                     │
│  Base: nginx:alpine                             │
├─────────────────────────────────────────────────┤
│  1. Install wget for health checks              │
│  2. Copy static files from builder              │
│  3. Copy custom nginx.conf                      │
│  4. Configure health check                      │
│  Result: Optimized image ~50MB                  │
└─────────────────────────────────────────────────┘
```

## Data Flow

### User Request Flow

```
1. User Browser
        │
        ▼
2. Frontend (React App)
        │
        ├─► Static Assets (cached)
        │
        └─► API Request
                │
                ▼
3. Backend (Spring Boot)
        │
        ├─► JWT Validation
        │
        ├─► Business Logic
        │
        └─► Database Query
                │
                ▼
4. Database (MySQL)
        │
        ├─► Execute Query
        │
        └─► Return Results
                │
                ▼
5. Backend (Format Response)
        │
        ▼
6. Frontend (Update UI)
        │
        ▼
7. User sees result
```

## Security Architecture

```
┌─────────────────────────────────────────────────────┐
│               Security Layers                        │
├─────────────────────────────────────────────────────┤
│  1. Network Layer                                   │
│     - Firewall rules                                │
│     - Port restrictions                             │
│     - HTTPS/TLS encryption                          │
├─────────────────────────────────────────────────────┤
│  2. Application Layer                               │
│     - JWT Authentication                            │
│     - Role-based Access Control (RBAC)              │
│     - CORS configuration                            │
│     - Security headers (Nginx)                      │
├─────────────────────────────────────────────────────┤
│  3. Container Layer                                 │
│     - Non-root users                                │
│     - Minimal base images (Alpine)                  │
│     - Health checks                                 │
│     - Resource limits                               │
├─────────────────────────────────────────────────────┤
│  4. Database Layer                                  │
│     - User privileges (least privilege)             │
│     - Network isolation                             │
│     - Persistent volumes                            │
│     - Regular backups                               │
└─────────────────────────────────────────────────────┘
```

## Deployment Environments

### Development Environment

```
┌──────────────────────────────────────┐
│      Development (Local/Dev)         │
├──────────────────────────────────────┤
│  Configuration: docker-compose.yml   │
│  Database: Exposed on localhost:3306│
│  Backend: Exposed on localhost:8081 │
│  Frontend: Exposed on localhost:80  │
│  Features:                           │
│    - Hot reload supported            │
│    - Debug logs enabled              │
│    - Default credentials             │
│    - Auto schema updates             │
└──────────────────────────────────────┘
```

### Production Environment

```
┌──────────────────────────────────────┐
│      Production (Cloud/Server)       │
├──────────────────────────────────────┤
│  Config: docker-compose.prod.yml     │
│  Database: Localhost only (internal) │
│  Backend: Localhost only (internal)  │
│  Frontend: Public (behind proxy)     │
│  Features:                           │
│    - SSL/TLS encryption              │
│    - Secure credentials              │
│    - Log rotation                    │
│    - Schema validation only          │
│    - Resource limits                 │
└──────────────────────────────────────┘
```

## Health Check System

```
┌─────────────────────────────────────────┐
│         Health Check Flow                │
├─────────────────────────────────────────┤
│                                          │
│  Docker Engine                           │
│       │                                  │
│       ├─► Frontend Container             │
│       │    └─► wget http://localhost/    │
│       │         (every 30s)              │
│       │                                  │
│       ├─► Backend Container              │
│       │    └─► wget /actuator/health     │
│       │         (every 30s)              │
│       │                                  │
│       └─► Database Container             │
│            └─► mysqladmin ping           │
│                 (every 10s)              │
│                                          │
│  If unhealthy (3 retries):               │
│    - Container marked unhealthy          │
│    - Depends_on conditions fail          │
│    - Auto-restart triggered              │
└─────────────────────────────────────────┘
```

## CI/CD Pipeline (GitHub Actions)

```
┌─────────────────────────────────────────────────┐
│              GitHub Actions Workflow            │
├─────────────────────────────────────────────────┤
│                                                  │
│  Trigger: Push/PR to main/develop               │
│       │                                          │
│       ├─► Job 1: Validate                       │
│       │    ├─► docker-compose.yml               │
│       │    └─► Run validate-deployment.sh       │
│       │                                          │
│       ├─► Job 2: Build Backend                  │
│       │    ├─► Setup Docker Buildx              │
│       │    ├─► Build Docker image               │
│       │    └─► Cache layers                     │
│       │                                          │
│       ├─► Job 3: Build Frontend                 │
│       │    ├─► Setup Docker Buildx              │
│       │    ├─► Build Docker image               │
│       │    └─► Cache layers                     │
│       │                                          │
│       ├─► Job 4: Test Backend                   │
│       │    ├─► Start MySQL service              │
│       │    ├─► Run mvn test                     │
│       │    └─► Generate reports                 │
│       │                                          │
│       └─► Job 5: Test Frontend                  │
│            ├─► npm ci                            │
│            ├─► npm test                          │
│            └─► npm run build                     │
│                                                  │
│  Result: All checks must pass                   │
└─────────────────────────────────────────────────┘
```

## Network Architecture

### Docker Network Configuration

```
┌──────────────────────────────────────────────────┐
│      coffee-shop-network (Bridge)                │
│      Subnet: 172.20.0.0/16 (Production)          │
├──────────────────────────────────────────────────┤
│                                                   │
│  Container: database                             │
│  ├─ IP: Dynamic (172.20.0.x)                    │
│  ├─ Internal Port: 3306                         │
│  └─ External Port: 3306 (dev), localhost (prod) │
│                                                   │
│  Container: backend                              │
│  ├─ IP: Dynamic (172.20.0.x)                    │
│  ├─ Internal Port: 8081                         │
│  └─ External Port: 8081 (dev), localhost (prod) │
│                                                   │
│  Container: frontend                             │
│  ├─ IP: Dynamic (172.20.0.x)                    │
│  ├─ Internal Port: 80                           │
│  └─ External Port: 80/443                       │
│                                                   │
│  DNS: Containers resolve by name                 │
│  - frontend can reach "backend:8081"             │
│  - backend can reach "database:3306"             │
└──────────────────────────────────────────────────┘
```

## Volume Management

```
┌────────────────────────────────────────┐
│         Docker Volumes                 │
├────────────────────────────────────────┤
│                                         │
│  mysql_data (Persistent)                │
│  ├─ Type: Docker volume                │
│  ├─ Mount: /var/lib/mysql              │
│  └─ Data: Database files               │
│                                         │
│  Bind Mounts (Read-only):               │
│  ├─ setup-mysql.sql → init script      │
│  ├─ nginx.conf → Nginx config          │
│  └─ ssl/ → SSL certificates (optional) │
└────────────────────────────────────────┘
```

## Scaling Considerations

### Horizontal Scaling (Future)

```
┌─────────────────────────────────────┐
│       Load Balancer (Nginx)         │
└──────────┬──────────────────────────┘
           │
    ┌──────┼──────┬──────────┐
    │      │      │          │
┌───▼──┐ ┌─▼───┐ ┌▼────┐  ┌─▼────┐
│ FE 1 │ │ FE 2│ │ BE 1│  │ BE 2 │
└──────┘ └─────┘ └─┬───┘  └──┬───┘
                   │         │
              ┌────▼─────────▼────┐
              │   Database Cluster │
              │   (Primary/Replica)│
              └────────────────────┘
```

## Monitoring Stack (Optional Enhancement)

```
┌─────────────────────────────────────────┐
│          Monitoring Stack               │
├─────────────────────────────────────────┤
│  Prometheus                              │
│  ├─ Metrics collection                  │
│  └─ Time-series database                │
│                                          │
│  Grafana                                 │
│  ├─ Visualization                        │
│  └─ Alerting                             │
│                                          │
│  Loki (Optional)                         │
│  ├─ Log aggregation                      │
│  └─ Log querying                         │
└─────────────────────────────────────────┘
```

## Deployment Decision Tree

```
Do you have Docker installed?
├─ Yes ─┐
│       │
│       ├─ Development/Testing?
│       │  └─ Use: docker-compose.yml
│       │
│       └─ Production?
│          └─ Use: docker-compose.prod.yml
│
└─ No ──┐
        │
        ├─ Install Docker (Recommended)
        │
        └─ Manual Setup
           ├─ Install Java 17
           ├─ Install Node.js 18
           ├─ Install MySQL 8
           └─ Follow manual setup guide
```

## Summary

This architecture provides:

1. **Containerization**: Isolated, reproducible environments
2. **Multi-stage Builds**: Optimized image sizes
3. **Health Checks**: Automatic failure detection and recovery
4. **Security**: Multiple layers of protection
5. **Scalability**: Ready for horizontal scaling
6. **Monitoring**: Health endpoints for observability
7. **Automation**: CI/CD pipeline for continuous delivery

For detailed deployment instructions, see:
- [QUICKSTART.md](QUICKSTART.md) - Quick deployment
- [DEPLOYMENT.md](DEPLOYMENT.md) - Complete guide
- [DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md) - Feature overview
