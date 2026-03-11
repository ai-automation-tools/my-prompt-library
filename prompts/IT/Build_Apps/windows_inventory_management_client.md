---
title: "Windows Inventory Management Client"
tags: ["it", "build-apps", "windows", "inventory", "management"]
category: "IT"
subcategory: "Build_Apps"
---
# Windows Inventory Management Client

Build a fully-featured, offline-capable Windows Desktop application for managing warehouse inventory, tracking stock levels, and generating reports.

---

## Role & Context

You are a senior Windows application developer specializing in desktop applications with a strong focus on data management and reporting.

**Tech Stack (Fixed):**
- **Frontend:** C#, WPF (Windows Presentation Foundation), MVVM pattern
- **Backend:** C# (.NET 8/9), Entity Framework Core
- **Database:** SQLite (local offline storage) with sync capabilities to a central server (SQL Server)
- **Reporting:** Crystal Reports or FastReport.NET
- **Deployment:** MSIX Installer / ClickOnce

---

## Product Requirements

### Core Features

#### 1) Stock Management
Comprehensive CRUD operations for inventory items.
- Add, update, view, and delete products (SKU, Name, Category, Price, Quantity).
- Barcode scanner integration (HID device support).
- Set minimum stock thresholds and alerts.

#### 2) Transaction History
Detailed tracking of inventory movements.
- Record inbound shipments (Restock).
- Record outbound shipments (Sales/Dispatch).
- Adjustments for damaged or lost goods.

#### 3) Reporting and Analytics
Generate insights from inventory data.
- Daily/Weekly/Monthly stock level reports.
- Low stock alert dashboard.
- Export reports to PDF, Excel (XLSX), and CSV.

---

## Technical Requirements

### Architecture
An MVVM (Model-View-ViewModel) architecture ensuring separation of concerns between the UI (XAML) and business logic (C#). Local SQLite database acting as the primary data store, with a background sync service communicating with a central REST API.

### Data Model
- **Product:** Id, SKU, Name, Description, CategoryId, Price, Quantity, MinThreshold, IsActive
- **Category:** Id, Name, Description
- **Transaction:** Id, ProductId, Type (In/Out/Adjust), Quantity, Date, UserId, Remarks
- **User:** Id, Username, Role, PasswordHash

### API Design (Sync Server - Mocked for this build)
- Background worker pinging `GET /api/sync/inventory` for updates.
- Background worker pushing local changes via `POST /api/sync/transactions`.

### Security Requirements
- Local application login screen (Admin, Operator).
- Role-based UI restriction (Operators cannot delete products).
- Encrypted local configuration file (connection strings, sync tokens).

### Performance Requirements
- Application launch time under 3 seconds.
- Data grid loading for 100,000+ records should implement virtualization and load in under 500ms.

---

## Implementation Details

### MVVM Setup
Use CommunityToolkit.Mvvm for boilerplate reduction.
- Setup `MainViewModel` for navigation between views (Dashboard, Inventory, Reports, Settings).
- Use `RelayCommand` for button actions and `ObservableProperty` for two-way binding.

### Database Context
Configure `AppDbContext` inheriting from `DbContext` (EF Core).
- Enable SQLite PRAGMA journal_mode=WAL for better concurrent read/write performance.
- Use asynchronous queries (`ToListAsync()`, `FirstOrDefaultAsync()`) to prevent UI blocking.

---

## UI/UX Requirements

### Key Pages/Views
1. **Dashboard:** High-level metrics, low stock alerts, and quick actions (Scan Barcode).
2. **Inventory Grid:** DataGrid view with filtering, sorting, and pagination.
3. **Product Details:** Form for adding/editing a specific item with image upload support.
4. **Settings:** Sync configuration, user management, and database backup options.

### Design Principles
- Modern Windows 11 design language (Fluent Design System) using libraries like MahApps.Metro or Fluent.Avalonia (if applicable).
- Support for Light and Dark themes.
- Clear, high-contrast typography and iconography.

---

## Testing & Validation

### Unit Tests
- Test ViewModels (business logic, command execution) independently of Views using NUnit or xUnit.
- Mock the database context and services using Moq.

### Integration Tests
- Test SQLite database operations (CRUD).
- Test CSV/Excel export functionality.

### E2E Tests
- Basic UI automation testing using Appium or WinAppDriver.

---

## Deployment & Operations

### Environment Setup
- Configure build profiles (Debug, Release) in Visual Studio.
- Ensure proper dependency injection setup in `App.xaml.cs`.

### Deployment Steps
1. Create MSIX packaging project.
2. Configure application icon, manifest, and versioning.
3. Build signed installer for distribution.

### Monitoring & Logging
- Implement local file logging using NLog or Serilog (e.g., `logs/app.log`).
- Log unhandled exceptions at the application level (`DispatcherUnhandledException`).

---

## Documentation Requirements

Generate:
- [ ] README.md with build and run instructions
- [ ] Application architecture documentation
- [ ] Database schema diagram
- [ ] User manual (PDF) explaining features like barcode scanning and reporting

---

## Constraints & Limitations

- Application must run completely offline without internet connection.
- Target framework must be .NET 8 or higher.
- Memory footprint should not exceed 250MB during typical use.

---

## Success Criteria

The project is complete when:
- [ ] Application compiles and runs without errors.
- [ ] User can log in and navigate between Dashboard, Inventory, and Reports.
- [ ] CRUD operations save correctly to the local SQLite database.
- [ ] Barcode scanning input correctly populates the search/add fields.
- [ ] Installer packages successfully.

---

## Tags

`#project` `#csharp` `#wpf` `#windows` `#desktop` `#build` `#inventory`

---

**Version:** 1.0 | **Created:** 2024-03-05 | **Updated:** 2024-03-05