import express from 'express';
import next from 'next';

const app = next({ dev: false }); // 프로덕션 모드로 설정
const handle = app.getRequestHandler();

const server = express();
const port = process.env.PORT || 3000;

app.prepare().then(() => {
  server.all('*', (req, res) => {
    return handle(req, res); // 모든 요청을 Next.js 핸들러로 전달
  });

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
