# Implementation Plan - Azure Migration

This plan outlines the steps to migrate the Coffee Shop Management System to Azure.

## Phase 1: Preparation
- [ ] Update `SecurityConfig.java` to permit public access to static resources (for combined frontend/backend deployment).
- [ ] Create a `WebConfig.java` to handle React routing (forwarding non-API requests to `index.html`).
- [ ] Verify local builds of both backend and frontend.

## Phase 2: Resource Provisioning
- [ ] Ensure Azure CLI is logged in (`az login`).
- [ ] Execute `azure-setup.ps1` to create:
    - Resource Group (`CoffeeShopRG`)
    - MySQL Flexible Server
    - App Service Plan
    - Web App (Java 17)
    - App Settings (DB connection strings)

## Phase 3: Build and Deployment
- [ ] Run `deploy_azure.ps1`. This script will:
    - Build the React frontend with the correct API URL.
    - Copy the build artifacts to the backend's static folder.
    - Build the unified Spring Boot JAR.
    - Optionally run `azure-setup.ps1` to provision resources.
    - Deploy the JAR to Azure App Service.

## Phase 4: Database Initialization
- [ ] Configure MySQL Firewall for local access in the Azure Portal.
- [ ] Run `setup-mysql.sql` on the Azure MySQL instance using a tool like MySQL Workbench.


## Phase 5: Verification
- [ ] Access the Azure Web App URL.
- [ ] Test login and basic CRUD operations.
