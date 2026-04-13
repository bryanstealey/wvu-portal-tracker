import type { DashboardData } from './types';
import { readFile } from 'fs/promises';
import { join } from 'path';

/**
 * Read dashboard data.
 * In production: reads from Vercel Blob.
 * In development: reads from local seed.json.
 */
export async function readDashboard(): Promise<DashboardData> {
  // Production: Vercel Blob
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { list } = await import('@vercel/blob');
      const blobs = await list({ prefix: 'dashboard.json' });
      if (blobs.blobs.length > 0) {
        const response = await fetch(blobs.blobs[0].url);
        return await response.json();
      }
    } catch (error) {
      console.error('Failed to read from Vercel Blob:', error);
    }
  }

  // Development fallback: local seed file
  try {
    const seedPath = join(process.cwd(), 'data', 'seed.json');
    const raw = await readFile(seedPath, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    console.error('Failed to read seed data:', error);
    return {
      players: [],
      news: [],
      lastPipelineRun: new Date().toISOString(),
      pipelineStatus: 'down',
      seenUrls: [],
    };
  }
}
