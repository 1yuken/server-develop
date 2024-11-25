const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

if (isMainThread) {
    const Mutex = require('async-mutex').Mutex;
    const mutex = new Mutex();

    const n = parseInt(process.argv[2] || "2");
    const m = parseInt(process.argv[3] || "2");
    let counter = 0;

    const start = Date.now();

    const runThreads = async () => {
        const promises = [];
        for (let i = 0; i < n + m; i++) {
            promises.push(new Promise((resolve) => {
                const worker = new Worker(__filename, {
                    workerData: {
                        type: i < n ? "increment" : "decrement",
                        iterations: 100000
                    }
                });

                worker.on("message", async (result) => {
                    await mutex.runExclusive(() => {
                        counter += result;
                    });
                    resolve();
                });
            }));
        }

        await Promise.all(promises);
        // console.log(`Final Counter: ${counter}`);
        console.log(`Execution Time: ${Date.now() - start} ms`);
    };

    runThreads();
} else {
    const { type, iterations } = workerData;
    let localCounter = 0;

    for (let i = 0; i < iterations; i++) {
        localCounter += type === "increment" ? 1 : -1;
    }

    parentPort.postMessage(localCounter);
}