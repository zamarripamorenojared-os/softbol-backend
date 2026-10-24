const { parentPort } = require('node:worker_threads');

if (parentPort) {
  parentPort.on('message', (taskData) => {
    const { projectId, sampleSize = 500000 } = taskData;
    let sum = 0;
    for (let i = 0; i < sampleSize; i++) {
      sum += Math.sqrt(i);
    }

    const metrics = {
      projectId,
      sampleSize,
      computedSum: sum,
      averageVariance: sum / sampleSize,
      processedAt: new Date().toISOString()
    };

    parentPort.postMessage(metrics);
  });
}
