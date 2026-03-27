---
name: 🛠️ sql-query-optimizer
description: Optimize, analyze, and rewrite SQL queries for performance. Use this skill when asked to tune slow queries, add indexes, or explain query execution plans.
---

# SQL Query Optimizer

This skill is designed to take existing SQL queries and suggest optimizations, index strategies, and architectural improvements to ensure fast execution times and scalability.

## Principles

When reviewing a query, prioritize:

1. **Avoid `SELECT *`**: Explicitly declare all columns needed. This reduces network overhead and memory usage.
2. **Index Usage**: Check if `WHERE`, `JOIN`, `ORDER BY`, and `GROUP BY` clauses are using appropriate indexes. Recommend composite indexes where necessary.
3. **Sargable Conditions**: Ensure `WHERE` clauses are SARGable (Search Argument Able). For instance, avoid functions on columns (`WHERE YEAR(date_column) = 2023` -> `WHERE date_column >= '2023-01-01' AND date_column < '2024-01-01'`).
4. **Subqueries vs. JOINs**: Evaluate if correlated subqueries can be rewritten as `JOIN`s or `EXISTS` clauses for better execution plans.
5. **Data Types**: Suggest matching data types in `JOIN` conditions to prevent implicit conversions that can ignore indexes.
6. **Limit/Offset**: Identify issues with large `OFFSET` pagination and recommend keyset pagination (seek method) instead.

## Optimization Workflow

When asked to optimize a query, structure your response as follows:

### 1. Analysis of Original Query
Identify the bottlenecks in the provided query (e.g., full table scans, Cartesian products, non-sargable predicates).

### 2. The Optimized Query
Provide the rewritten query formatted cleanly with standard SQL capitalization conventions.

```sql
SELECT
    u.id,
    u.email,
    o.order_date
FROM users u
INNER JOIN orders o ON u.id = o.user_id
WHERE u.status = 'active'
  AND o.order_date >= '2023-01-01'
ORDER BY o.order_date DESC
LIMIT 10;
```

### 3. Explanation of Changes
Bullet-point the specific changes made and *why* they improve performance (e.g., "Changed `IN (SELECT ...)` to `EXISTS (...)` to allow the optimizer to short-circuit").

### 4. Index Recommendations
Provide specific `CREATE INDEX` statements to support the optimized query. Explain why these indexes are chosen (e.g., covering indexes).

```sql
-- Creates a composite index covering the status filter and the join key
CREATE INDEX idx_users_status_id ON users (status, id);

-- Creates an index to support the join and the order by clause
CREATE INDEX idx_orders_user_id_date ON orders (user_id, order_date DESC);
```

### 5. Execution Plan Context (Optional)
If applicable, explain what to look for in the `EXPLAIN` or `EXPLAIN ANALYZE` output to verify the optimization was successful (e.g., "Ensure the plan shows an Index Seek instead of a Table Scan on the `orders` table").
