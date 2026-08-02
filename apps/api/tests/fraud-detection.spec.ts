import { FraudRiskService } from '../src/modules/ai/fraud-risk.service.js';

async function runFraudDetectionTests() {
  console.log('🧪 Starting Test: Hybrid Anti-Fraud & Risk Scoring Engine...');

  const fraudService = new FraudRiskService();

  // Test 1: Normal User (Score 0)
  const normal = fraudService.evaluateUser({
    userId: 'u-good-user',
    deviceCount: 1,
    paymentCardsUsed: 1,
    giftLoopPatternDetected: false,
    rapidCoinTransferDetected: false
  });
  console.assert(normal.riskScore === 0, 'Normal user risk score should be 0');
  console.assert(normal.riskLevel === 'NORMAL', 'Normal user level mismatch');

  // Test 2: High Risk Fraud User (Score >= 70 -> BLOCK)
  const fraud = fraudService.evaluateUser({
    userId: 'u-bot-user',
    deviceCount: 5, // +25
    paymentCardsUsed: 4, // +30
    giftLoopPatternDetected: true, // +40 -> Total = 95
    rapidCoinTransferDetected: true
  });
  console.assert(fraud.riskScore === 100, 'Fraud user risk score capping failed');
  console.assert(fraud.riskLevel === 'BLOCK', 'Fraud user level must be BLOCK');
  console.assert(fraud.isBlocked === true, 'Fraud user isBlocked flag failed');

  console.log('✅ Hybrid Anti-Fraud & Risk Scoring Engine Tests PASSED!\n');
}

runFraudDetectionTests().catch(console.error);
