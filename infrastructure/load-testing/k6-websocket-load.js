import ws from 'k6/ws';
import { check } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 1000 },
    { duration: '1m', target: 10000 },
    { duration: '2m', target: 100000 }, // Ramp to 100,000 Concurrent Virtual Users
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    ws_connecting: ['p(95)<100'],
  },
};

export default function () {
  const url = 'wss://api-staging.auralive.app/ws';
  const params = { tags: { my_tag: 'aura_ws_stress' } };

  const res = ws.connect(url, params, function (socket) {
    socket.on('open', function () {
      // Send JOIN_ROOM payload
      socket.send(JSON.stringify({ event: 'JOIN_ROOM', roomId: 'room-load-101' }));
    });

    socket.on('message', function (data) {
      const msg = JSON.parse(data);
      check(msg, { 'valid room event': (m) => m.event !== undefined });
    });

    socket.setTimeout(function () {
      socket.close();
    }, 10000);
  });

  check(res, { 'status is 101': (r) => r && r.status === 101 });
}
