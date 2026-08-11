# Project Instructions

## Stack

- Ruby 3.4
- Rails 8
- PostgreSQL
- Redis
- Sidekiq

## Architecture

- When naming methods, variables, class, functions and files it should be intent obvious
- If there's a future improvment suggested, it should implement it so no more future improvement
- Follow rubocop coding style
- Follow stricter/cleaner SOLID principles.
- S — Single Responsibility Principle (SRP)
- O — Open/Closed Principle (OCP) Software entities should be open for extension but closed for modification.
- L — Liskov Substitution Principle (LSP) A subclass should be usable anywhere its parent class is expected without changing the correctness of the program.
- I — Interface Segregation Principle (ISP) Prefer small, focused interfaces over large, general-purpose ones. Classes should implement only the behavior they actually require.
- D — Dependency Inversion Principle (DIP) Depend on interfaces or abstractions instead of concrete implementations. This improves flexibility, testability, and maintainability.
- Follow DRY (Don't repeat yourself) - make it reusable if possible - and scan any existing code that we can reuse

# SOLID Principles

## S — Single Responsibility Principle (SRP)

**What it means**

A class, module, or function should have only one reason to change.

**Goal**

Each component should have exactly one responsibility. If a class is responsible for multiple concerns (e.g., database operations, business logic, and UI rendering), split those responsibilities into separate classes or services.

**Example**

❌ Bad

```ruby
class UserService
  def create_user(params)
    User.create!(params)
    UserMailer.welcome_email.deliver_now
    AuditLog.create!(action: "User Created")
  end
end
```

✅ Good

```ruby
class CreateUserService
  def call(params)
    User.create!(params)
  end
end

class SendWelcomeEmailService
  def call(user)
    UserMailer.welcome_email(user).deliver_now
  end
end

class AuditLogger
  def self.user_created(user)
    AuditLog.create!(action: "User Created", user: user)
  end
end
```

---

## O — Open/Closed Principle (OCP)

**What it means**

Software entities should be open for extension but closed for modification.

**Goal**

New functionality should be added by extending existing code rather than modifying stable, working code. Prefer polymorphism, composition, or strategy patterns over large conditional statements.

**Example**

❌ Bad

```ruby
def calculate_discount(customer)
  if customer.vip?
    0.20
  elsif customer.employee?
    0.30
  else
    0
  end
end
```

✅ Good

```ruby
class DiscountStrategy
  def discount
    0
  end
end

class VipDiscount < DiscountStrategy
  def discount
    0.20
  end
end

class EmployeeDiscount < DiscountStrategy
  def discount
    0.30
  end
end
```

---

## L — Liskov Substitution Principle (LSP)

**What it means**

A subclass should be usable anywhere its parent class is expected without changing the correctness of the program.

**Goal**

Subclasses must honor the behavior and contract of their parent classes. They should not remove expected behavior or introduce unexpected exceptions.

**Example**

❌ Bad

```ruby
class Bird
  def fly
    # ...
  end
end

class Penguin < Bird
  def fly
    raise "Penguins can't fly"
  end
end
```

✅ Good

Separate flying behavior into its own abstraction rather than forcing every bird to implement it.

---

## I — Interface Segregation Principle (ISP)

**What it means**

Clients should not be forced to depend on methods they do not use.

**Goal**

Prefer small, focused interfaces over large, general-purpose ones. Classes should implement only the behavior they actually require.

**Example**

❌ Bad

```ruby
class Worker
  def work; end
  def eat; end
  def sleep; end
end
```

A robot shouldn't have to implement `eat` or `sleep`.

✅ Good

```ruby
module Workable
  def work; end
end

module Eatable
  def eat; end
end
```

---

## D — Dependency Inversion Principle (DIP)

**What it means**

High-level modules should not depend on low-level modules. Both should depend on abstractions.

**Goal**

Depend on interfaces or abstractions instead of concrete implementations. This improves flexibility, testability, and maintainability.

**Example**

❌ Bad

```ruby
class ReportService
  def initialize
    @mailer = GmailMailer.new
  end
end
```

✅ Good

```ruby
class ReportService
  def initialize(mailer)
    @mailer = mailer
  end
end
```

Now any mailer implementation can be injected without changing `ReportService`.

---

# SOLID Checklist

Before submitting code, verify the following:

- [ ] Each class has a single responsibility.
- [ ] New features extend existing code instead of modifying stable code.
- [ ] Subclasses can safely replace their parent classes.
- [ ] Interfaces/modules are small and focused.
- [ ] Dependencies are injected through abstractions rather than hardcoded implementations.
- [ ] Business logic is separated from controllers and views.
- [ ] Classes remain small, readable, and easy to test.
- Use service objects for business logic.
- Controllers should remain thin.
- Dependency Injection where appropriate.

## Testing

Before finishing:

- bundle exec rspec
- bundle exec rubocop
- bundle exec brakeman

## Style

- Prefer small methods.
- Avoid callbacks unless necessary.
- Use ActiveRecord scopes instead of complex controller queries.
- Document public service objects.

## Naming

- Services end with `Service`
- Jobs end with `Job`
- Queries end with `Query`

# Documentation Standards

Documentation is part of every feature. Code changes are not complete until the
corresponding documentation has been updated.

## For every new feature

Create or update a document under `/docs`.

Suggested structure:

docs/
├── feature-name.md
├── another-feature.md
└── adr/
└── ...

Each feature document should include:

# Overview

- Purpose of the feature
- Business problem being solved
- Create a table if needed to make the explanation organize and easy to understand especially but not limited to database tables and columns

# Requirements

- Functional requirements
- Non-functional requirements

# Business Rules

- Validation rules
- Permissions
- Edge cases

# Technical Design

- Architecture
- Services involved
- Models
- Database changes
- Background jobs
- External APIs

# Flow

- Step-by-step request lifecycle

# API

- Endpoints
- Request examples
- Response examples

# Testing

- Unit tests
- Integration tests
- Manual test scenarios

# Future Improvements

- Known limitations
- Possible enhancements

---

## Pull Request Documentation

For every completed feature, generate a PR description in:

docs/pr/<ticket-id>-pr.md

Template:

# Summary

## What changed

## Why

## Database Changes

## Breaking Changes

## Testing Performed

## Screenshots (if applicable)

## Deployment Notes

## Rollback Plan

---

## Ticket Documentation

For every feature, generate:

docs/tickets/<ticket-id>.md

Include:

# Ticket Summary

# Background

# Acceptance Criteria

- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

# Technical Notes

# Dependencies

# Risks

# Out of Scope

---

## README Navigation Index

`README.md` is the primary entry point for all project documentation.

### Rules

- Keep the Documentation section up to date.
- Every document under `/docs` must be discoverable from `README.md`.
- Whenever documentation is added, renamed, moved, or removed, update the navigation index.
- Never leave orphaned documentation that is not linked from `README.md`.
- Organize links hierarchically using nested Markdown lists.
- Group documentation by category to improve discoverability.
- Keep entries sorted alphabetically within each category unless a logical ordering is required.
- Link using relative paths.

### Documentation Navigation

Maintain a documentation index similar to:

```text
Documentation
├── Features
│   ├── User Registration
│   ├── Authentication
│   └── Notifications
├── Fixes
│   ├── Duplicate Emails
│   └── Login Timeout
├── Chores
│   └── Rails 8 Upgrade
├── Architecture
│   ├── Authentication Flow
│   ├── Caching
│   └── Background Jobs
├── ADR
│   ├── ADR-0001 Service Objects
│   └── ADR-0002 Dependency Injection
├── Tickets
│   ├── ABC-123
│   └── ABC-456
└── Pull Requests
    ├── ABC-123
    └── ABC-456
```

### Expected README Format

```md
# Documentation

- Features
  - [Authentication](docs/features/authentication.md)
  - [Notifications](docs/features/notifications.md)
  - [User Registration](docs/features/user-registration.md)

- Fixes
  - [Duplicate Emails](docs/fixes/duplicate-emails.md)
  - [Login Timeout](docs/fixes/login-timeout.md)

- Chores
  - [Rails 8 Upgrade](docs/chores/rails-8-upgrade.md)

- Architecture
  - [Authentication Flow](docs/architecture/authentication-flow.md)
  - [Background Jobs](docs/architecture/background-jobs.md)
  - [Caching](docs/architecture/caching.md)

- ADR
  - [ADR-0001 Service Objects](docs/adr/0001-service-objects.md)
  - [ADR-0002 Dependency Injection](docs/adr/0002-dependency-injection.md)

- just create the docs for this part but don't include in the readme doc
- Tickets
  - [ABC-123](docs/tickets/ABC-123.md)
  - [ABC-456](docs/tickets/ABC-456.md)

- Pull Requests
  - [ABC-123](docs/pr/ABC-123.md)
  - [ABC-456](docs/pr/ABC-456.md)
```

### Maintenance

Whenever documentation changes:

- Create the document if it does not exist.
- Update the corresponding entry in `README.md`.
- Remove links to deleted documents.
- Rename links when documentation is renamed.
- Preserve a clean and organized hierarchy.
- Ensure every document is reachable within three levels of the Documentation section.
