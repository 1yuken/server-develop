const { Mutex } = require('async-mutex');
const os = require('os');

let counter = 0;
const mutex = new Mutex();
const numIterations = 100000;

async function incrementCounter() {
    for (let i = 0; i < numIterations; i++) {
        const release = await mutex.acquire();
        try {
            counter++;
        } finally {
            release();
        }
    }
}

async function decrementCounter() {
    for (let i = 0; i < numIterations; i++) {
        const release = await mutex.acquire();
        try {
            counter--;
        } finally {
            release();
        }
    }
}

async function runThreads(n, m) {
    counter = 0;
    const threads = [];

    for (let i = 0; i < n; i++) threads.push(incrementCounter());
    for (let i = 0; i < m; i++) threads.push(decrementCounter());

    const startTime = Date.now();
    await Promise.all(threads);
    const executionTime = Date.now() - startTime;
    return { counter, executionTime };
}

async function main() {
    const results = [];
    for (const threads of [1, 2, 4, 8]) {
        const { counter: counterValue, executionTime } = await runThreads(threads, threads);
        results.push({ threads, counterValue, executionTime });
    }

    const systemSpec = `OS: ${os.type()} ${os.release()}\nProcessor: ${os.cpus()[0].model}\nMemory (RAM): ${Math.round(os.totalmem() / (1024 ** 3))} GB\n`;

    let table = "Threads | Counter Value | Execution Time (ms)\n";
    table += "----------------------------------------------\n";
    for (const { threads, counterValue, executionTime } of results) {
        table += `${threads.toString().padEnd(7)} | ${counterValue.toString().padEnd(13)} | ${executionTime.toFixed(2).padEnd(18)}\n`;
    }

    const fullOutput = systemSpec + "\n" + table;

    require('fs').writeFileSync("Lab8.txt", fullOutput);
    console.log("Результаты сохранены в файл Lab8.txt");
}

main().catch(console.error);
