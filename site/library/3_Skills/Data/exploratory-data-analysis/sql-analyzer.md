---
title: "📊 SQL Analyzer"
tags: ["skill", "sql", "data", "analytics"]
category: "Skills"
subcategory: "Data"
name: "📊 sql-analyzer"
description: "Parses and analyzes SQL queries to identify performance bottlenecks and suggest index optimizations. Use when: (1) a query is running slowly, (2) reviewing PRs containing complex joins, (3) optimizing database schemas. NOT for: modifying live production data."
---

# SQL Analyzer

This skill allows the agent to review raw SQL queries, analyze their EXPLAIN plans, and provide concrete recommendations for query optimization, such as adding indexes, rewriting subqueries as joins, or identifying missing filtering conditions.

## Prerequisites

- **Required Tool/Service:** PostgreSQL/MySQL CLI client (optional, for EXPLAIN plans)
- **Permissions:** Read-only access to database schema (if live analysis is needed)

### Setup Instructions

1. For static analysis, no setup is required.
2. For dynamic EXPLAIN analysis, configure database credentials in environment variables.

**Verification:**
```bash
psql -V
```

## Usage

### Basic Usage

Analyze a raw SQL string for common anti-patterns.

**What it does:**
1. Parses the SQL syntax
2. Identifies full table scans, Cartesian products, or non-sargable conditions
3. Outputs recommendations

### Common Workflows

#### Workflow 1: Query Optimization

When a user provides a slow query.

**Steps:**
1. Agent identifies `SELECT *` or missing `WHERE` clauses.
2. Agent rewrites the query explicitly listing columns.
3. Agent suggests specific `CREATE INDEX` commands.

## Examples

### Example 1: Optimizing a non-sargable query

**Context:** A query using `WHERE YEAR(created_at) = 2023` is running slowly.

**Task:** Rewrite the query to use indexes effectively.

**Output:**
```sql
-- Original
SELECT id FROM users WHERE YEAR(created_at) = 2023;

-- Optimized
SELECT id FROM users WHERE created_at >= '2023-01-01' AND created_at < '2024-01-01';
```

**Explanation:**
Wrapping columns in functions prevents the database from using indexes. The agent rewrites the condition to be sargable.

## Best Practices

### Do's ✅

- Always suggest analyzing `EXPLAIN` output before applying indexes blindly.
- Consider the write-penalty when suggesting new indexes.

### Don'ts ❌

- Do not suggest dropping existing indexes without full context of the application's workload.

## File Structure

```
sql-analyzer/
├── SKILL.md              # This file
```
