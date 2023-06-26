const express = require('express');
const router = express.Router();
//import * as tweetController from '../controller/tweet.js';

router.get('/', (req, res, next) => {
  res.send('user router');
});
module.exports = router;
