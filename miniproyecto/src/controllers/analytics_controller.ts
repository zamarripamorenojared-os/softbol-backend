import { Request, Response } from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { WorkerPool } from '../utils/worker_pool';

const workerPathCandidate = path.join(__dirname, '../workers/analytics_worker.js');

const pool = new WorkerPool(workerPathCandidate, 4);

export class AnalyticsController {
  public static async getProjectMetricsHandler(req: Request, res: Response): Promise<void> {
    try {
      const { projectId } = req.params;
      // Delegamos el cómputo intensivo al pool de Worker Threads
      const metrics = await pool.runTask({ projectId, sampleSize: 500000 });
      res.status(200).json({
        success: true,
        data: metrics
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error procesando analíticas del proyecto',
        error: error.message
      });
    }
  }
}
