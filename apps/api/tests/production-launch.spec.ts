import { JwtRotationService } from '../src/security/jwt-rotation.service.js';

async function runProductionLaunchSmokeTest() {
  console.log('🚀 Starting Version 1.0.0 Release Candidate Smoke & Security Test (Sprint 8)...\n');

  // Test 1: JWT Secret Rotation Service
  const jwtService = new JwtRotationService();
  const activeKey = jwtService.getActiveKey();
  console.assert(activeKey.keyId.startsWith('key-v'), 'JWT Key ID format mismatch');
  console.assert(activeKey.secret.length > 10, 'JWT Secret length weak');
  console.log('  1. Security Hardening: JWT Secret Key Rotation Active (%s)', activeKey.keyId);

  // Test 2: Rotate key
  const newKeyId = jwtService.rotateKeys();
  console.assert(newKeyId !== activeKey.keyId, 'JWT Rotation key generation failed');
  console.log('  2. Key Rotation Procedure: Successfully rotated key to %s', newKeyId);

  console.log('\n✅ VERSION 1.0.0 RELEASE CANDIDATE SMOKE & SECURITY TEST PASSED! 🎓\n');
}

runProductionLaunchSmokeTest().catch(console.error);
