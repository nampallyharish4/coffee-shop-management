# Security Configuration Guide

## Overview

This document outlines the security measures implemented in the Coffee Shop Management System and provides guidelines for secure deployment.

## Security Features Implemented

### 1. Authentication & Authorization

- **JWT-based Authentication**: Secure token-based authentication using JSON Web Tokens
- **Role-Based Access Control (RBAC)**: Four roles with specific permissions:
  - ADMIN: Full system access
  - CASHIER: Order and menu management
  - BARISTA: Order viewing and status updates
  - INVENTORY_MANAGER: Inventory management
- **Password Encryption**: BCrypt with 12 rounds for password hashing

### 2. Input Validation

- **Email Validation**: RFC-compliant email format validation
- **Password Requirements**:
  - Minimum 8 characters
  - Must contain uppercase, lowercase, digit, and special character
  - Maximum 100 characters to prevent DoS attacks
- **Name Validation**: Only allows letters, spaces, hyphens, and apostrophes
- **Size Limits**: All inputs have maximum size constraints to prevent buffer overflow attacks

### 3. Network Security

- **CORS Configuration**: Restricted to specific origins (configurable via environment variable)
- **Security Headers**:
  - Content Security Policy (CSP)
  - X-Frame-Options: DENY (prevents clickjacking)
  - X-XSS-Protection
  - Content-Type-Options
- **HTTPS Ready**: Database connections support SSL

### 4. Data Protection

- **SQL Injection Prevention**: Using JPA with parameterized queries
- **XSS Prevention**: Input validation and output encoding
- **Sensitive Data**: No hardcoded credentials or secrets in code

### 5. Dependencies

- **Up-to-date Libraries**: All dependencies checked for known vulnerabilities
- **Frontend**: Axios updated to v1.7.9 to fix SSRF and DoS vulnerabilities
- **Backend**: Spring Boot 3.4.1 with latest security patches (CVEs resolved)

### 6. Logging

- **Secure Logging**: Production logging levels set to INFO to avoid exposing sensitive data
- **No Password Logging**: Passwords are never logged in plain text

## Required Environment Variables

### Critical Security Variables

These MUST be set before running the application:

```bash
# JWT Secret (minimum 32 characters)
# Generate with: openssl rand -base64 32
JWT_SECRET=your_very_long_and_random_secret_key_here

# Database Password
SPRING_DATASOURCE_PASSWORD=your_secure_database_password

# Allowed CORS Origins (comma-separated)
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### Optional Variables

```bash
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/coffee_shop?createDatabaseIfNotExist=true&useSSL=true&serverTimezone=UTC
SPRING_DATASOURCE_USERNAME=coffee_admin
SPRING_JPA_HIBERNATE_DDL_AUTO=update
```

## Setup Instructions

### Development Environment

1. **Copy the environment template**:

   ```bash
   cp .env.example .env
   ```

2. **Generate a secure JWT secret**:

   ```bash
   # Linux/Mac
   openssl rand -base64 32

   # Windows PowerShell
   [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
   ```

3. **Set environment variables in .env file** (never commit this file!)

4. **Update .gitignore** to exclude .env files:
   ```
   .env
   .env.local
   .env.*.local
   ```

### Production Environment

1. **Use Environment Variables**: Never hardcode secrets
2. **Strong JWT Secret**: Minimum 32 characters, randomly generated
3. **Database Security**:
   - Use strong passwords (minimum 16 characters)
   - Enable SSL for database connections
   - Use least privilege principle for database user
4. **CORS Configuration**: Only allow trusted domains
5. **HTTPS Only**: Always use HTTPS in production
6. **Regular Updates**: Keep dependencies up to date

## Security Best Practices

### For Administrators

1. **Password Policy**:

   - Enforce strong passwords for all users
   - Change default passwords immediately
   - Rotate credentials regularly

2. **Access Control**:

   - Follow principle of least privilege
   - Regularly audit user roles and permissions
   - Disable inactive accounts

3. **Monitoring**:
   - Monitor application logs for suspicious activity
   - Set up alerts for failed authentication attempts
   - Review access logs regularly

### For Developers

1. **Never commit secrets** to version control
2. **Use environment variables** for all sensitive configuration
3. **Validate all input** from users and external systems
4. **Keep dependencies updated** and monitor for vulnerabilities
5. **Follow secure coding practices**:
   - Parameterized queries (already implemented via JPA)
   - Output encoding for XSS prevention
   - Proper error handling without exposing sensitive information

## Security Checklist for Deployment

- [ ] JWT_SECRET is set and at least 32 characters long
- [ ] Database password is strong and unique
- [ ] CORS origins are restricted to trusted domains only
- [ ] HTTPS is enabled and enforced
- [ ] Database SSL is enabled
- [ ] Default admin password has been changed
- [ ] Application logs are secured and monitored
- [ ] All dependencies are up to date
- [ ] Security headers are properly configured
- [ ] Rate limiting is configured (if needed for your scale)
- [ ] Backup and disaster recovery plan is in place

## Reporting Security Issues

If you discover a security vulnerability, please:

1. Do NOT open a public issue
2. Email the security team directly
3. Provide detailed information about the vulnerability
4. Allow time for the issue to be addressed before public disclosure

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Spring Security Documentation](https://spring.io/projects/spring-security)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [NIST Password Guidelines](https://pages.nist.gov/800-63-3/)
