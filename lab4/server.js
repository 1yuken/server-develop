const dgram = require('dgram');
const readline = require('readline');

// Настройки для группы и порта
const MULTICAST_ADDRESS = '233.0.0.1';
const PORT = 1502;

// Создаем UDP-сокет
const server = dgram.createSocket('udp4');

// Настраиваем интерфейс для ввода сообщений в консоли
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'Введите сообщение: '
});

// Событие отправки сообщения
rl.prompt();
rl.on('line', (message) => {
  const msgBuffer = Buffer.from(message);
  server.send(msgBuffer, 0, msgBuffer.length, PORT, MULTICAST_ADDRESS, (err) => {
    if (err) {
      console.error('Ошибка при отправке сообщения:', err);
    } else {
      console.log(`Сообщение отправлено: ${message}`);
    }
    rl.prompt();
  });
});

// Настраиваем сервер на мультикаст
server.on('listening', () => {
  const address = server.address();
  console.log(`Сервер слушает ${address.address}:${address.port}`);
  server.setBroadcast(true);
  server.setMulticastTTL(128);
  server.addMembership(MULTICAST_ADDRESS);
});

// Запускаем сервер на указанном порту
server.bind(PORT);