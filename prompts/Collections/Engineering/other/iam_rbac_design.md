---
title: "Prompt: Design a Comprehensive IAM/RBAC and ABAC System for a Multi-Tenant SaaS Platform"
tags: ["collections", "engineering", "rbac", "design"]
category: "Collections"
subcategory: "Engineering"
---
# Prompt: Design a Comprehensive IAM/RBAC and ABAC System for a Multi-Tenant SaaS Platform

## Persona

You are a principal security architect and engineer with deep expertise in Identity and Access Management (IAM), Role-Based Access Control (RBAC), and Attribute-Based Access Control (ABAC). You have a proven track record of designing and implementing secure, scalable, and maintainable access control systems for large-scale, multi-tenant SaaS platforms. You are a master of security best practices, including the principle of least privilege, separation of duties, and zero-trust architecture.

## Objective

Design a comprehensive and robust IAM/RBAC and ABAC system for a multi-tenant SaaS platform called "AX Workspaces". This platform allows organizations (tenants) to manage their own users, resources, and data in isolated environments. The system must be flexible enough to accommodate different tenant sizes and security requirements, and it must be auditable to meet compliance standards.

## Context

**Platform:** AX Workspaces
**Tenancy Model:** Multi-tenant with data isolation between tenants. Each tenant has its own dedicated workspace.
**Core Resources:**
- **Workspace:** The top-level container for a tenant's data and users.
- **Projects:** Containers for work within a a workspace.
- **Datasets:** Collections of data within a project.
- **Pipelines:** Data processing workflows.
- **Users:** Individuals who have access to the workspace.
- **Teams:** Groups of users within a workspace.

## Requirements

### 1. Roles and Permissions (RBAC)

- **Define a set of default roles** for a typical tenant, including but not limited to:
    - **Workspace Admin:** Full control over the workspace, including billing, user management, and workspace settings.
    - **Project Manager:** Can create and manage projects, and manage project members and their roles.
    - **Data Engineer:** Can create and manage datasets and pipelines.
    - **Data Analyst:** Can view and query datasets and pipelines.
    - **Viewer:** Read-only access to specific resources.
- **For each role, define a clear set of permissions.** Use a granular permission model (e.g., `projects:create`, `datasets:read`, `users:invite`).
- **The system must support custom roles.** Tenants should be able to create their own roles with a specific set of permissions.

### 2. Attribute-Based Access Control (ABAC)

- **Design an ABAC model** that complements the RBAC system. This will be used for more fine-grained access control.
- **Identify key attributes** for users, resources, and the environment that can be used in ABAC policies. Examples include:
    - **User Attributes:** User's location, department, on-call status.
    - **Resource Attributes:** Data classification (e.g., PII, confidential), project sensitivity.
    - **Environment Attributes:** Time of day, IP address, device type.
- **Provide examples of ABAC policies.** For instance:
    - "Allow access to datasets with 'PII' classification only to users in the 'Compliance' department from a corporate IP address."
    - "Deny access to pipelines outside of business hours for users who are not on-call."

### 3. User and Team Management

- **Describe the user lifecycle management process:** invitation, onboarding, and off-boarding.
- **Explain how users can be organized into teams.**
- **Detail how roles and permissions can be assigned to both individual users and teams.**

### 4. Audit Logging

- **Design a comprehensive audit logging system.**
- **Specify the events that should be logged**, including but not limited to:
    - User authentication events (login, logout, failed login).
    - All API requests, including the user, resource, and action.
    - All permission changes.
    - All role and policy changes.
- **Define the format of the audit logs.** They should be structured (e.g., JSON) and contain all relevant information for security analysis.
- **Explain how tenants can access and export their audit logs.**

## Deliverable

A detailed markdown document that outlines the design of the IAM/RBAC and ABAC system. The document should be organized into the following sections:

1.  **IAM/RBAC System Design**
    -   Default Roles and Permissions
    -   Custom Roles
2.  **ABAC System Design**
    -   Attribute Definitions
    -   Example Policies
3.  **User and Team Management**
4.  **Audit Logging**

The document should be well-written, clear, and concise. It should be a practical guide that a development team can use to implement the system.