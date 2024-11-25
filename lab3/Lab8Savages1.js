const { Worker, isMainThread, parentPort, workerData } = require("worker_threads");

if (isMainThread) {
    const N = 5; // Вместимость кастрюли
    const NUM_SAVAGES = 10; // Количество дикарей
    let pot = 0; // Текущее количество порций в кастрюле

    const mutex = new (require("async-mutex").Mutex)();

    const fillPot = async () => {
        await mutex.runExclusive(() => {
            if (pot === 0) {
                console.log("Повар наполняет кастрюлю");
                pot = N; // Повар наполняет кастрюлю до полной ёмкости
            }
        });
    };

    const eatFromPot = async (id) => {
        await mutex.runExclusive(async () => {
            if (pot > 0) {
                console.log(`Дикарь ${id} берет порцию. Осталось: ${pot - 1}`);
                pot--;
                if (pot === 0) {
                    console.log(`Дикарь ${id} зовет повара!`);
                    await fillPot(); // Зовём повара, если кастрюля пуста
                }
            }
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