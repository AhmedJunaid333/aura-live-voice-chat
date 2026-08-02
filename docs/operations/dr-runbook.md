# Disaster Recovery (DR) Operations Runbook

## Target RTO / RPO
- **RTO (Recovery Time Objective)**: <= 30 minutes
- **RPO (Recovery Point Objective)**: <= 5 minutes

## PostgreSQL PITR Restore Procedure
1. Stop API traffic.
2. Restore latest WAL archive from S3 bucket: `sh infrastructure/disaster-recovery/dr-restore-test.sh`.
3. Point API connection string to restored database endpoint.
