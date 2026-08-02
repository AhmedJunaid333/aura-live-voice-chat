# ADR-007: Event-Driven Domain Event Bus Architecture

## Status
Accepted

## Context
Modules like PK Battles, AI Recommendation, and Leaderboards need asynchronous notification of domain events without tight coupling.

## Decision
Domain events (`GIFT_SENT`, `PK_SCORE_UPDATED`, `USER_LEVEL_UP`) are published via Redis Pub/Sub event bus to independent worker consumers.
