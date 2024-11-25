const { execSync } = require('child_process');
const fs = require('fs');

const runProgram = (threads) => {
    const output = execSync(`node Lab8Sync.js ${threads} ${threads}`).toString();
    return output;
};

const getSystemInfo = () => {
    try {
        // Получение информации о процессоре
        const cpuInfo = execSync('wmic cpu get name, NumberOfCores, MaxClockSpeed /format:list')
            .toString()
            .trim();

        // Получение информации о памяти
        const memoryRaw = execSync('wmic memorychip get capacity')
            .toString()
            .trim()
            .split('\n')
            .slice(1) // Пропускаем заголовок "Capacity"
            .map(line => parseInt(line.trim(), 10)); // Конвертируем строки в числа
        const memoryTotalGB = memoryRaw.reduce((sum, capacity) => sum + capacity, 0) / (1024 ** 3); // Конвертируем в ГБ

        // Получение информации об операционной системе
        const osInfo = execSync('wmic os get Caption /format:list')
            .toString()
            .trim();

        return `
CPU Info:
${cpuInfo}

Memory Info:
Total Memory: ${memoryTotalGB.toFixed(2)} GB

OS Info:
${osInfo}
        `;
    } catch (err) {
        return 'System info not available';
    }
};

const results = [];
[1, 2, 4, 8].forEach((threads) => {
    console.log(`Running with ${threads} threads`);
    const result = runProgram(threads);
    results.push(`Threads: ${threads}\n${result}\n`);
});

fs.writeFileSync("Lab8.txt", results.join("\n"));

// Получение системной информации
const systemInfo = getSystemInfo();
fs.writeFileSync("specs.txt", systemInfo);

console.log("Results saved to Lab8.txt and specs.txt.");