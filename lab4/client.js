const dgram = require('dgram');

const MULTICAST_ADDRESS = '233.0.0.1';
const PORT = 1502; // Порт, на котором сервер отправляет сообщения

const client = dgram.createSocket('udp4');

client.on('message', (msg, rinfo) => {
  console.log(`Сообщение от ${rinfo.address}:${rinfo.port} - ${msg.toString()}`);
});

client.on('listening', () => {
  const address = client.address();
  console.log(`Клиент слушает ${address.address}:${address.port}`);
  client.addMembership(MULTICAST_ADDRESS); // Присоединяемся к мультикаст-группе
});

// Используем порт 0, чтобы клиент сам выбрал свободный порт
client.bind(0);