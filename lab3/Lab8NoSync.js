const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

if (isMainThread) {
    // Читаем количество потоков из аргументов
    const n = parseInt(process.argv[2] || "2"); // Инкремент
    const m = parseInt(process.argv[3] || "2"); // Декремент
    const totalThreads = n + m;
    const iterations = 100000; // Количество операций на поток

    let counter = 0; // Общий счетчик
    const start = Date.now(); // Время начала выполнения

    // Создаём потоки
    const promises = Array.from({ length: totalThreads }, (_, i) => {
        return new Promise((resolve) => {
            const worker = new Worker(__filename, {
                workerData: {
                    type: i < n ? "increment" : "decrement",
                    iterations,
                },
            });

            // Обрабатываем результат потока
            worker.on("message", (result) => resolve(result));
        });
    });

    // Ждём завершения всех потоков
    Promise.all(promises).then((results) => {
        counter = results.reduce((sum, value) => sum + value, 0); // Считаем итоговый счетчик
        // console.log(`Final Counter: ${counter}`);
        console.log(`Execution Time: ${Date.now() - start} ms`);
    });
} else {
    // Логика работы в дочернем потоке
    const { type, iterations } = workerData;
    const localCounter = (type === "increment" ? 1 : -1) * iterations;
    parentPort.postMessage(localCounter); // Возвращаем результат
}