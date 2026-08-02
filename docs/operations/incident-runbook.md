# Operations Incident Response Runbook

## Severity 1: API / WebSocket Outage
1. Check Prometheus Grafana dashboard alert rules.
2. Inspect pod logs via `kubectl logs -n aura-live -l app=aura-api`.
3. If error rate > 2%, trigger automatic rollback: `helm rollback aura-api`.

## Severity 2: Redis Cluster Degradation
1. Verify Redis Sentinel master node status: `redis-cli cluster info`.
2. Failover to replica node if primary is unresponsive.
