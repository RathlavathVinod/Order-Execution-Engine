import Fastify from 'fastify';
import { Queue, Worker } from 'bullmq';
import WebSocket from 'ws';

// Create Fastify server instance
const fastify = Fastify({ logger: true });

// BullMQ Queue setup
const queue = new Queue('order-queue', { 
  connection: { 
    host: 'localhost', 
  },
});

// BullMQ Worker setup
const worker = new Worker('order-queue', async job => {
  // Job processing logic here
  console.log('Processing job:', job.id);
  return job.data;
}, { 
  connection: { 
    host: 'localhost', 
  },
});

// WebSocket server setup
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
  console.log('Client connected');
  ws.on('message', function incoming(message) {
    console.log('Received:', message);
  });
  ws.send('Welcome to the Order Execution Engine!');
});

// Start Fastify server
fastify.listen(3000, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Server listening at ${address}`);
});