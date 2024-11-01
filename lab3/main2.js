const { Mutex } = require('async-mutex');

// Конфигурация кастрюли и потоков
const MAX_PORTIONS = 5; // Максимальное количество порций
let currentPortions = MAX_PORTIONS; // Изначально кастрюля полна

const mutex = new Mutex(); // Мьютекс для синхронизации доступа к кастрюле

// Функция для дикарей
async function savage(name) {
    const release = await mutex.acquire();
    try {
        // Если кастрюля пустая, ждем, пока повар ее наполнит
        if (currentPortions === 0) {
            console.log(`${name} обнаружил, что кастрюля пуста, зовем повара...`);
            await cook();
        }
        // Дикарь берет порцию
        currentPortions--;
        console.log(`${name} взял одну порцию. Осталось порций: ${currentPortions}`);
    } finally {
        release(); // Освобождаем мьютекс
    }
}

// Функция для повара
async function cook() {
    const release = await mutex.acquire();
    try {
        if (currentPortions === 0) {
            currentPortions = MAX_PORTIONS;
            console.log(`Повар наполнил кастрюлю. Порций в кастрюле: ${currentPortions}`);
        }
    } finally {
        release(); // Освобождаем мьютекс
    }
}

// Основная функция для запуска дикарей
async function main() {
    const numSavages = 8; // Количество дикарей больше, чем кастрюля может вместить
    const savagePromises = [];

    // Запускаем потоки дикарей
    for (let i = 1; i <= numSavages; i++) {
        savagePromises.push(savage(`Дикарь ${i}`));
    }

    await Promise.all(savagePromises); // Ожидаем завершения всех дикарей
    console.log('Все дикари закончили обед');
}

main();