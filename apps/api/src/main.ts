// Aura Live Voice Room - API Gateway Entry Point
import { AuthController } from './controllers/auth.controller.js';
import { UsersController } from './controllers/users.controller.js';
import { LiveController } from './controllers/live.controller.js';
import { SeatController } from './controllers/seat.controller.js';
import { GiftController } from './controllers/gift.controller.js';
import { WalletController } from './controllers/wallet.controller.js';

export class AuraApiServer {
  readonly auth = new AuthController();
  readonly users = new UsersController();
  readonly live = new LiveController();
  readonly seats = new SeatController();
  readonly gifts = new GiftController();
  readonly wallet = new WalletController();

  start(port: number = 3000) {
    console.log(`🚀 Aura Live Voice Room API Gateway running on port ${port}`);
    console.log(`📍 Endpoint Prefix: /api/v1/`);
  }
}

const server = new AuraApiServer();
server.start(3000);
