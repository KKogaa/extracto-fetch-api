# Extracto Fetch API

A lightweight Fastify-based REST API for managing web scraping jobs. This service accepts scraping requests, validates them, and enqueues them for processing by worker instances.

## Features

- **RESTful API** - Submit and track scraping jobs
- **Action Validation** - Validate action-based workflows before queueing
- **Job Management** - Track job status and retrieve results
- **Queue Statistics** - Monitor queue health and metrics
- **Lightweight** - No Playwright dependencies, fast startup

## Architecture

This is the API layer of the Extracto scraping system:

```
Client → [Fetch API] → Redis Queue → [Spider Workers] → Results
```

- **Fetch API** (this project): Accepts requests, validates, enqueues jobs
- **Spider Workers**: Consumes jobs, executes scraping with Playwright
- **Redis**: Message broker for job queue

## Installation

```bash
npm install
```

## Configuration

Copy `.env.example` to `.env` and configure:

```env
PORT=3000
REDIS_HOST=localhost
REDIS_PORT=6379
NODE_ENV=development
```

## Development

Start the API server:

```bash
npm run dev
```

## Production

Build and start:

```bash
npm run build
npm start
```

## API Endpoints

### Submit Scraping Job

```bash
POST /fetch
Content-Type: application/json

{
  "url": "https://example.com",
  "actions": [
    { "type": "navigate", "url": "https://example.com" },
    { "type": "screenshot", "saveTo": "screenshot" }
  ]
}
```

Response:
```json
{
  "jobId": "1",
  "status": "queued",
  "url": "https://example.com",
  "actionsCount": 2
}
```

### Check Job Status

```bash
GET /job/:jobId
```

Response:
```json
{
  "jobId": "1",
  "state": "completed",
  "progress": 100,
  "data": { ... },
  "returnvalue": {
    "html": "...",
    "screenshot": "base64...",
    "extractedData": { ... }
  }
}
```

### Queue Statistics

```bash
GET /queue/stats
```

Response:
```json
{
  "waiting": 5,
  "active": 2,
  "completed": 100,
  "failed": 3
}
```

### Health Check

```bash
GET /health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Docker

Build the image:

```bash
docker build -t extracto-fetch-api .
```

Run:

```bash
docker run -p 3000:3000 \
  -e REDIS_HOST=redis \
  -e REDIS_PORT=6379 \
  extracto-fetch-api
```

## Related Projects

- [extracto-spider-worker](../extracto-spider-worker) - Worker service that processes scraping jobs

## License

MIT
