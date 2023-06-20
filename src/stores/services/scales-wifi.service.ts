import TcpSocket from 'react-native-tcp-socket';
import {Buffer} from 'buffer';

const options = {
  port: 1234,
  host: '192.168.4.1',
  reuseAddress: true,
};

const client = TcpSocket.createConnection(options, () => {});

client.on('data', function (data) {
  console.log('message was received', (data as Buffer).toString());
  client.destroy();
});

client.on('error', function (error) {
  console.log(error);
  client.destroy();
});

client.on('close', function () {
  console.log('Connection closed!');
  client.destroy();
});
