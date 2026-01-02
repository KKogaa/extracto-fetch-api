import Fastify from 'fastify';
import { Queue } from 'bullmq';
import { CONFIG } from './config';
import type { JobRequest, FetchJobData } from './types';
import { ActionValidator } from './services/action-validator.service';

const fastify = Fastify({
  logger: {
    level: CONFIG.nodeEnv === 'development' ? 'debug' : 'info',
  },
});

const fetchQueue = new Queue<FetchJobData>(CONFIG.queue.name, {
  connection: {
    host: CONFIG.redis.host,
    port: CONFIG.redis.port,
  },
});

fastify.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

fastify.post<{ Body: JobRequest }>('/fetch', async (request, reply) => {
  const { url, actions, options } = request.body;

  if (!url) {
    return reply.code(400).send({ error: 'URL is required' });
  }

  try {
    new URL(url);
  } catch {
    return reply.code(400).send({ error: 'Invalid URL format' });
  }

  // Validate actions if provided
  if (actions && actions.length > 0) {
    const validation = ActionValidator.validate(actions);
    if (!validation.valid) {
      return reply.code(400).send({
        error: 'Invalid actions',
        details: validation.errors,
      });
    }
  }

  const job = await fetchQueue.add('fetch-page', {
    url,
    jobId: `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    actions,
    options,
  });

  return {
    jobId: job.id,
    status: 'queued',
    url,
    actionsCount: actions?.length || 0,
  };
});

fastify.get<{ Params: { jobId: string } }>('/job/:jobId', async (request, reply) => {
  const { jobId } = request.params;

  const job = await fetchQueue.getJob(jobId);

  if (!job) {
    return reply.code(404).send({ error: 'Job not found' });
  }

  const state = await job.getState();
  const progress = job.progress;

  return {
    jobId: job.id,
    state,
    progress,
    data: job.data,
    returnvalue: job.returnvalue,
    failedReason: job.failedReason,
  };
});

fastify.get('/queue/stats', async () => {
  const [waiting, active, completed, failed] = await Promise.all([
    fetchQueue.getWaitingCount(),
    fetchQueue.getActiveCount(),
    fetchQueue.getCompletedCount(),
    fetchQueue.getFailedCount(),
  ]);

  return {
    waiting,
    active,
    completed,
    failed,
  };
});

const start = async () => {
  try {
    await fastify.listen({ port: CONFIG.port, host: '0.0.0.0' });
    console.log(`Server listening on port ${CONFIG.port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
