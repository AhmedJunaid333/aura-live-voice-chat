export interface QueueJob {
  id: string;
  type: 'NOTIFICATION' | 'GIFT_LEDGER_BATCH' | 'ANALYTICS_AGGREGATE' | 'AI_JOBS' | 'CRON_MAINTENANCE';
  payload: Record<string, any>;
  processedAt?: Date;
}

export class BackgroundWorkerService {
  private queue: QueueJob[] = [];
  private processedJobsCount = 0;

  addJob(type: QueueJob['type'], payload: Record<string, any>): QueueJob {
    const job: QueueJob = {
      id: `job-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type,
      payload
    };
    this.queue.push(job);
    return job;
  }

  async processNextJob(): Promise<QueueJob | null> {
    const job = this.queue.shift();
    if (!job) return null;

    job.processedAt = new Date();
    this.processedJobsCount++;
    return job;
  }

  getQueueLength(): number {
    return this.queue.length;
  }

  getProcessedCount(): number {
    return this.processedJobsCount;
  }
}
