const jwt = require('jsonwebtoken');
const { User } = require('../models');

module.exports = async (req, res, next) => {
  try {
    const { authorization } = req.cookies;

    if (!authorization) {
      return res.status(401).json({ message: '인증 정보가 없습니다' });
    }
    const [tokenType, token] = authorization.split(' ');

    if (tokenType !== 'Bearer') {
      return res
        .status(401)
        .json({ message: '토큰 타입이 일치하지 않습니다.' });
    }

    const decodedToken = jwt.verify(token, 'customized_secret_key');
    const userId = decodedToken.userId;
    console.log(userId);

    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      res.clearCookie('authorization');
      return res
        .status(401)
        .json({ message: '토큰 사용자가 존재하지 않습니다.' });
    }
    res.locals.user = user;
    req.userId = userId;

    next();
  } catch (error) {
    res.clearCookie('authorization');

    return res.status(401).json({
      message: '비정상적인 요청입니다.',
    });
  }
};
