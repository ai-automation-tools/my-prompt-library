---
title: "Swift Ios Expense Tracker"
tags: ["it", "build-apps", "swift", "expense", "tracker"]
category: "IT"
subcategory: "Build_Apps"
---
# Swift iOS Expense Tracker

Build a native iOS mobile application using Swift and SwiftUI designed to securely log, categorize, and visualize personal financial expenses on the go.

---

## Role & Context

You are a senior iOS engineer specializing in SwiftUI, Core Data, and modern iOS app architecture (MVVM), building a fast, offline-capable productivity app.

**Tech Stack (Fixed):**
- **Frontend:** Swift 5.9+, SwiftUI, Combine (or Swift Concurrency `async/await`)
- **Local Database:** Core Data or SwiftData
- **Backend Sync:** CloudKit (for seamless Apple ecosystem syncing)
- **Charts:** Swift Charts (iOS 16+)
- **Architecture:** MVVM (Model-View-ViewModel)

---

## Product Requirements

### Core Features

#### 1) Expense Logging
Quickly capture transactions.
- Fast-entry form with a custom numerical keypad.
- Categorization (e.g., Food, Transport, Utilities) with color-coded tags and SF Symbols.
- Attach receipts via camera or photo library.
- Recurring expense scheduling (subscriptions).

#### 2) Budget Management
Set limits and track spending.
- Define monthly/weekly budgets per category or overall.
- Visual indicators (progress bars) showing budget consumption.
- Alerts when approaching or exceeding limits (via local notifications).

#### 3) Analytics & Reporting
Understand spending habits.
- Interactive pie charts and bar graphs (monthly breakdowns).
- Filter expenses by date range and category.
- Export data to CSV for external use.

---

## Technical Requirements

### Architecture
An MVVM structure where the `View` (SwiftUI) observes a `ViewModel` (`ObservableObject` or `@Observable`), which in turn interfaces with the data layer (Core Data/SwiftData) and services. Utilize CloudKit for syncing across user devices without needing a custom backend.

### Data Model (Core Data Entities)
- **Expense:** id (UUID), amount (Decimal), date (Date), notes (String), receipt (Binary Data)
- **Category:** id (UUID), name (String), colorHex (String), iconName (String)
- **Budget:** id (UUID), amount (Decimal), period (Enum: Weekly/Monthly), startDate (Date)
- **Relationships:** Expense -> Category (Many-to-One), Budget -> Category (One-to-One optional)

### API Design (CloudKit Integration)
- Setup `NSPersistentCloudKitContainer` to handle background syncing.
- Ensure proper handling of merge conflicts (e.g., favor latest modified date).

### Security Requirements
- Biometric authentication (Face ID / Touch ID) to open the app (optional toggle in settings).
- Privacy manifests explaining the use of Camera (for receipts) and Photo Library.
- No third-party analytics SDKs; rely on Apple's built-in App Analytics.

### Performance Requirements
- Launch time under 1 second.
- Smooth scrolling of lists containing thousands of expense records using `LazyVStack` or `List`.
- Efficient image compression for receipt storage to prevent bloating the local database.

---

## Implementation Details

### UI/UX Design (SwiftUI)
- Use standard iOS interface elements (NavigationStack, TabView) to ensure a native feel.
- Implement dark mode and dynamic type (accessibility text sizes) support from the start.

### CloudKit Setup
- Configure the App ID in the Apple Developer Portal with CloudKit capabilities.
- Handle scenarios where the user is not signed into iCloud gracefully.

---

## UI/UX Requirements

### Key Pages/Views
1. **Dashboard (Home):** Summary of total spent this month vs. budget, recent transactions list.
2. **Add Expense Sheet:** Modal view focusing heavily on the amount input and category selection.
3. **Analytics (Charts):** Visual breakdowns and category comparisons.
4. **Settings:** Biometrics toggle, export data, manage categories.

### Design Principles
- Emphasize speed: The "Add Expense" button should be prominent (e.g., a floating action button or central tab).
- Clean, financial aesthetic (using semantic colors like system green for income, system red for expenses).
- Utilize haptic feedback (`UIImpactFeedbackGenerator`) for satisfying interactions when logging expenses.

---

## Testing & Validation

### Unit Tests
- Test calculation logic in ViewModels (e.g., summing expenses, checking budget limits).
- Test date formatting and currency parsing.

### UI Tests
- Use XCUITest to verify the core user journey: Tap Add -> Enter Amount -> Select Category -> Save -> Verify it appears in the list.

### E2E Tests
- Test CloudKit syncing (if possible) across two simulated devices logged into the same test Apple ID.

---

## Deployment & Operations

### Environment Setup
- Xcode 15+ required. Minimum deployment target iOS 16.0 (due to Swift Charts).

### Deployment Steps
1. Configure signing profiles and capabilities in Xcode.
2. Archive the build and upload to App Store Connect.
3. Distribute via TestFlight for internal beta testing.

### Monitoring & Logging
- Use `OSLog` for structured console logging during development and beta testing.
- Track crash reports via Xcode Organizer.

---

## Documentation Requirements

Generate:
- [ ] README.md with project setup and architecture overview
- [ ] List of custom SF Symbols and color hex codes used
- [ ] Brief guide on setting up the Core Data stack with CloudKit

---

## Constraints & Limitations

- Application size should be under 30MB.
- Must run efficiently on older supported devices (e.g., iPhone 8 running iOS 16).
- All calculations must use `Decimal` types to avoid floating-point errors.

---

## Success Criteria

The project is complete when:
- [ ] A user can add, edit, and delete an expense.
- [ ] A summary chart displays correct totals grouped by category.
- [ ] The app requires Face ID/Touch ID to open if enabled.
- [ ] The app builds successfully in Xcode without warnings.
- [ ] CloudKit syncing functions properly between devices (or handles offline mode correctly).

---

## Tags

`#project` `#swift` `#ios` `#swiftui` `#mobile` `#build` `#finance`

---

**Version:** 1.0 | **Created:** 2024-03-05 | **Updated:** 2024-03-05