const { Worker, isMainThread, parentPort, workerData } = require("worker_threads");

if (isMainThread) {
    const N = 5; // Вместимость кастрюли
    const NUM_SAVAGES = 10; // Количество дикарей
    let pot = 0; // Текущее количество порций в кастрюле

    const mutex = new (require("async-mutex").Mutex)();
    const queue = []; // Очередь ожидания для справедливого выполнения

    const fillPot = async () => {
        await mutex.runExclusive(() => {
            if (pot === 0) {
                console.log("Повар наполняет кастрюлю");
                pot = N;
                // Оповещаем всех ожидающих
                queue.forEach((resolve) => resolve());
                queue.length = 0; // Очищаем очередь
            }
        });
    };

    const eatFromPot = async (id) => {
        await new Promise((resolve) => {
            mutex.runExclusive(async () => {
                if (pot > 0) {
                    console.log(`Дикарь ${id} берет порцию. Осталось: ${pot - 1}`);
                    pot--;
                    resolve(); // Завершаем текущий вызов
                } else {
                    console.log(`Дикарь ${id} ожидает...`);
                    queue.push(resolve); // Добавляем в очередь ожидания
                }
                if (pot === 0 && queue.length === 0) {
                    await fillPot(); // Наполняем кастрюлю, если она пуста
                }
            });
        });
    };

    // Запускаем потоки дикарей
    for (let i = 0; i < NUM_SAVAGES; i++) {
        new Worker(__filename, { workerData: { id: i + 1 } });
    }
} else {
    const { id } = workerData;

    const savageTask = async () => {
        while (true) {
            await eatFromPot(id); // Дикарь пытается съесть порцию
            await new Promise((res) => setTimeout(res, Math.random() * 1000)); // Эмуляция времени между попытками
        }
    };

    savageTask();
}