const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors());
const routes = require('./routes/index.js');
app.use(routes);

app.listen(port, () => {
  console.log(port, '포트: 서버열림');
});
