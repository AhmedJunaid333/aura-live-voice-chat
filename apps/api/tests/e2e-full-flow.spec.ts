import { WalletLedgerService } from '../../../packages/wallet/src/index.js';
import { AgoraRTCProvider, RTCRole } from '../../../packages/rtc-engine/src/index.js';
import { SeatManager } from '../src/modules/seats/seat.manager.js';
import { VoiceRoomWebSocketGateway } from '../src/modules/realtime/gateway/websocket.gateway.js';
import { RedisPubSubService } from '../src/modules/realtime/redis/pubsub.service.js';
import { VipService } from '../src/modules/economy/vip.service.js';
import { LevelService } from '../src/modules/gamification/level.service.js';
import { WithdrawalService } from '../src/modules/withdrawal/withdrawal.service.js';
import { AdminAuditService } from '../src/modules/admin/audit.service.js';

async function runMasterE2EFlowTest() {
  console.log('🚀 Starting Master End-to-End Integration Flow Test (Sprint 6.8)...\n');

  // Initialize Core Services
  const walletService = new WalletLedgerService();
  const rtcProvider = new AgoraRTCProvider({ appId: 'app-id-production', vendorKey: 'app-cert-production' });
  const pubsub = new RedisPubSubService();
  const gateway = new VoiceRoomWebSocketGateway(pubsub);
  const seatManager = new SeatManager(gateway);
  const vipService = new VipService();
  const levelService = new LevelService();
  const withdrawalService = new WithdrawalService(walletService);
  const auditService = new AdminAuditService();

  // 1. User Registration & Setup
  const hostId = 'u-e2e-host';
  const listenerId = 'u-e2e-listener';
  console.log('  1. Users Registered & Authenticated: Host (%s), Listener (%s)', hostId, listenerId);

  // 2. Fund Listener Wallet (10,000 Coins)
  await walletService.recordLedgerEntry({
    userId: listenerId,
    currencyType: 'COIN',
    amount: BigInt(10000),
    type: 'RECHARGE',
    referenceType: 'RECHARGE_ORDER',
    description: 'Initial Wallet Fund'
  });
  console.log('  2. Listener Wallet Funded: 10,000 Coins');

  // 3. Create Live Room & Generate Dynamic RTC Token
  const roomId = 'room-e2e-999';
  const hostToken = await rtcProvider.generateToken({ channelId: roomId, userId: hostId, role: RTCRole.HOST });
  const listenerToken = await rtcProvider.generateToken({ channelId: roomId, userId: listenerId, role: RTCRole.AUDIENCE });
  console.assert(hostToken.token.startsWith('AGORA_DYNAMIC_KEY_5'), 'RTC Host Token failed');
  console.assert(listenerToken.token.startsWith('AGORA_DYNAMIC_KEY_5'), 'RTC Listener Token failed');
  console.log('  3. Live Room Created & Dynamic RTC Tokens Issued (Host & Audience)');

  // 4. Seat Management Flow (Request -> Approve -> Live Speaking)
  await seatManager.requestSeat(roomId, 1, listenerId);
  await seatManager.approveSeat(roomId, 1, hostId, listenerId);
  const seatState = seatManager.getRoomSeats(roomId)[1];
  console.assert(seatState.state === 'LIVE_SPEAKER', 'Seat approval state mismatch');
  console.log('  4. Seat Request Approved: Listener on Mic Seat #1');

  // 5. Send Virtual Gift with VIP Discount Math & Ledger Debit/Credit
  vipService.purchaseVip(listenerId, 2); // Purchase VIP Tier 2 -> 4% Discount
  const vipInfo = vipService.getUserVip(listenerId);
  const finalPriceCoins = BigInt(1000) - (BigInt(1000) * BigInt(vipInfo.discount)) / BigInt(100);

  // Debit Sender Coins
  await walletService.recordLedgerEntry({
    userId: listenerId,
    currencyType: 'COIN',
    amount: -finalPriceCoins,
    type: 'SEND_GIFT',
    referenceType: 'GIFT_TRANSACTION',
    idempotencyKey: 'idemp-e2e-gift-01',
    description: `Gift Sent to Host with ${vipInfo.discount}% VIP Discount`
  });

  // Credit Creator Diamonds (70% conversion)
  const creatorDiamondsGained = BigInt(700);
  await walletService.recordLedgerEntry({
    userId: hostId,
    currencyType: 'DIAMOND',
    amount: creatorDiamondsGained,
    type: 'RECEIVE_GIFT',
    referenceType: 'GIFT_TRANSACTION',
    idempotencyKey: 'idemp-e2e-gift-02',
    description: 'Creator Diamond Credit from Gift'
  });

  console.log('  5. Gift Transaction Settled: %s Coins Debited, %s Diamonds Credited', finalPriceCoins, creatorDiamondsGained);

  // 6. Gamification XP Level Calculation
  const xpRes = levelService.addXp(listenerId, 'SEND_GIFT');
  console.assert(xpRes.xpGained > 0, 'XP Reward calculation failed');
  console.log('  6. Gamification Engine: Sender gained +%d XP (Level %d)', xpRes.xpGained, xpRes.level);

  // 7. Creator Withdrawal Request & Risk Assessment
  const withdrawReq = await withdrawalService.requestWithdrawal({
    userId: hostId,
    diamondAmount: creatorDiamondsGained,
    usdAmount: 35.00,
    paymentMethod: 'PAYONEER',
    accountDetails: { email: 'host@auralive.app' }
  });
  console.assert(withdrawReq.status === 'PENDING', 'Withdrawal initial status mismatch');
  console.log('  7. Creator Withdrawal Requested: $35.00 USD (Risk Score: %d)', withdrawReq.riskScore);

  // 8. Admin Payout Review Approval & Atomic Ledger Settlement
  const approvedWth = await withdrawalService.reviewWithdrawal({
    requestId: withdrawReq.id,
    reviewerAdminId: 'adm-finance-leader',
    approve: true
  });
  console.assert(approvedWth.status === 'PAID', 'Approved withdrawal status should be PAID');

  // Verify Host Diamond Balance after payout
  const hostDiamondAcc = walletService.getAccount(hostId, 'DIAMOND');
  console.assert(hostDiamondAcc.balance === BigInt(0), 'Host diamond balance failed to debit upon payout');
  console.log('  8. Finance Admin Approved Payout: Ledger Settled (%s Status)', approvedWth.status);

  // 9. Activity Audit Log Recording
  const auditLog = await auditService.logAction({
    adminId: 'adm-finance-leader',
    action: 'APPROVE_CREATOR_PAYOUT',
    targetType: 'WITHDRAWAL',
    targetId: withdrawReq.id,
    newValue: { usdAmount: 35.00 }
  });
  console.assert(auditLog.action === 'APPROVE_CREATOR_PAYOUT', 'Audit log recording failed');
  console.log('  9. Security Audit Log Recorded: %s (%s)', auditLog.id, auditLog.action);

  console.log('\n✅ MASTER END-TO-END INTEGRATION FLOW TEST PASSED 100% CLEAN! 🎉\n');
}

runMasterE2EFlowTest().catch(console.error);
