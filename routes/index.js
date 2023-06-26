const express = require('express');
const router = express.Router();

router.use('/api', (req, res, next) => {
  return res.status(200).json({ message: 'api routes' });
});

module.exports = router;
