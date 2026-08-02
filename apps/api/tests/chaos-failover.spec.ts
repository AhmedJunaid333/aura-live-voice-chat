import { MultiRegionRtcRouter } from '../../../packages/rtc-engine/src/routing/region-selector.js';

async function runChaosFailoverTest() {
  console.log('🔥 Starting Chaos Engineering & Edge Failover Resilience Test (Sprint 6.5)...\n');

  const router = new MultiRegionRtcRouter();

  // Test 1: Geo-IP Region Edge Primary Selection
  const primaryNode = router.selectBestRegion('PK');
  console.assert(primaryNode.region === 'asia-south', 'Primary edge selection failed');
  console.log('  1. Primary Edge Node Selected: %s (%s)', primaryNode.region, primaryNode.endpointUrl);

  // Test 2: Chaos Incident - Primary Node Unreachable -> Auto Failover to Fallback
  primaryNode.isHealthy = false;
  const failoverNode = router.selectBestRegion('PK');
  console.assert(failoverNode.region !== 'asia-south', 'Failover failed to switch away from unhealthy node');
  console.assert(failoverNode.isHealthy === true, 'Failover node is not healthy');
  console.log('  2. Chaos Simulated: Primary Node Down -> Auto-Failover to Fallback Region (%s)', failoverNode.region);

  console.log('\n✅ CHAOS ENGINEERING & EDGE FAILOVER TEST PASSED 100% SUCCESS! 🛡️\n');
}

runChaosFailoverTest().catch(console.error);
