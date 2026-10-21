import cluster from 'cluster';
import os from 'os';
import { ExpressServer } from './express_server';
import { DDLUtil } from './utils/ddl_util';
import { CacheUtil } from './utils/cache_util';
import { UsersUtil } from './utils/users_util';
import { QueueWorker } from './workers/queue_worker';
import { TaskOrchestrator } from './controllers/task_orchestrator';
import { runEventStreamDemo } from './events/stream_processor';
import { runEventLoopDemo } from './perf/event_loop_demo';

// Manejo de banderas terminales de demostración
if (process.argv.includes('--init')) {
  DDLUtil.init()
    .then(() => {
      console.log('Sembrado de datos finalizado correctamente.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error durante el sembrado inicial:', error);
      process.exit(1);
    });
} else if (process.argv.includes('--orchestrator')) {
  // Demostración de patrones creacionales y estructurales (Capítulo 11)
  const orchestrator = new TaskOrchestrator();
  orchestrator
    .processTaskAttachment('tsk-102', '/tmp/doc.pdf', '+526671234567')
    .then(() => {
      console.log('✔ Proceso de orquestación de tarea finalizado sin errores.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Error en orquestación de tarea:', err);
      process.exit(1);
    });
} else if (process.argv.includes('--stream-demo')) {
  // Demostración de Event Sourcing y CQRS (Capítulo 17)
  runEventStreamDemo()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
} else if (process.argv.includes('--perf-demo')) {
  // Demostración de Event Loop y microtareas (Capítulo 18)
  runEventLoopDemo();
} else {
  const isSingle = process.env.SINGLE_INSTANCE === 'true' || process.argv.includes('--single');
  if (!isSingle && cluster.isPrimary) {
    const numCPUs = os.cpus().length;
    console.log(`Master process ${process.pid} is running. Forking for ${numCPUs} CPUs...`);

    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
      console.log(`Worker process ${worker.process.pid} died. Restarting...`);
      cluster.fork();
    });
  } else {
    const server = new ExpressServer();

    // Inicializar el cliente de almacenamiento en caché de Redis
    new CacheUtil();

    // Inicializar procesador de colas BullMQ en segundo plano
    try {
      const queueWorker = new QueueWorker();
      queueWorker.beginProcessing();
    } catch (e) {
      console.warn('QueueWorker inicializado en modo tolerante a fallos');
    }

    // Ejecutar precarga de caché diferida a los 10 segundos del arranque
    setTimeout(() => {
      UsersUtil.putAllUsersInCache();
    }, 10000);

    process.on('uncaughtException', (error: Error) => {
      console.error(`Uncaught exception in worker process ${process.pid}:`, error);
      server.closeServer();
    });

    process.on('SIGINT', () => {
      console.log('Received SIGINT. Closing worker process...');
      server.closeServer();
    });

    process.on('SIGTERM', () => {
      console.log('Received SIGTERM. Closing worker process...');
      server.closeServer();
    });
  }
}
