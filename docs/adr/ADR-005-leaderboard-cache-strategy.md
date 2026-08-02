# ADR-005: Leaderboard Caching via Redis Sorted Sets

## Status
Accepted

## Context
High-concurrency gifting triggers frequent leaderboard rank queries (Daily, Weekly, Monthly, Global, Country). Direct SQL aggregations will bottleneck at high scale.

## Decision
We utilize Redis Sorted Sets (`ZADD`, `ZREVRANGE`) for sub-millisecond leaderboard rank lookups and atomic score increments.
