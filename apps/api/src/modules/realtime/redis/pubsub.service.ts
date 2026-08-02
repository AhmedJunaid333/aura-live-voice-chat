// Redis Pub/Sub Adapter Engine for Multi-node WebSockets
export class RedisPubSubService {
  private subscribers: Map<string, Array<(channel: string, message: string) => void>> = new Map();

  async publish(channel: string, payload: any): Promise<number> {
    const message = JSON.stringify(payload);
    const handlers = this.subscribers.get(channel) || [];
    for (const handler of handlers) {
      handler(channel, message);
    }
    return handlers.length;
  }

  async subscribe(channel: string, handler: (channel: string, message: string) => void): Promise<void> {
    const handlers = this.subscribers.get(channel) || [];
    handlers.push(handler);
    this.subscribers.set(channel, handlers);
  }

  async unsubscribe(channel: string): Promise<void> {
    this.subscribers.delete(channel);
  }
}
