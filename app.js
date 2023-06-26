const express = require('express');

const app = express();
const port = 3000;

app.use(express.json());

const routes = require('./routes/index.js');
app.use(routes);

app.listen(port, () => {
  console.log(port, '포트: 서버열림');
});
