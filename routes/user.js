const express = require('express');
const { User } = require('../models');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const router = express.Router();
const authmiddleware = require('../middlewares/middleware.js');
require('dotenv').config();

//import * as tweetController from '../controller/tweet.js';

// 이메일 인증 body에 email 값 받으면 내 email에서 해당 email로 인증코드 전송.
router.post('/email', async (req, res) => {
  const { email } = req.body;
  const authNum = Math.random().toString(18).substring(2, 8);
  const authtoken = jwt.sign(
    {
      authNum: authNum,
    },
    'secret_key'
  );

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS,
    },
  });
  try {
    if (!email) {
      return res
        .status(412)
        .json({ errorMessage: '데이터 형식이 올바르지 않습니다..' });
    }
    await transporter.sendMail({
      from: `"11조 👻" <${process.env.NODEMAILER_USER}>`,
      to: email,
      subject: 'Hello 이메일 인증 요청 ✔', // Subject line
      text: 'Hello world?', // plain text body
      html: `<h1>${authNum}</h1>`, // html body
    });
    res.cookie('authorization', `Bearer ${authtoken}`);
    return res.status(201).json({ message: '인증 키가 발송되었습니다.' });
  } catch (error) {
    return res
      .status(400)
      .json({ errorMessage: '인증 키 발송에 실패하였습니다.' });
  }
});

// 회원가입
router.post('/sginup', async (req, res) => {
  const { email, emailConfirm, nickname, password, confirm } = req.body;
  const pattern = new RegExp('^[a-zA-Z][0-9a-zA-Z]{2,}$'); //조건 정규식
  const isExistEmail = await User.findOne({ where: { email } });
  const isExistNick = await User.findOne({ where: { nickname } });
  //------------------------------------------------암호화----------------------------------------------------------------------
  const salt = await bcrypt.genSalt(10); // 값이 높을 수록 암호화 연산이 증가. 하지만 암호화하는데 속도가 느려진다.
  const hash = await bcrypt.hash(password, salt); //bcrypt.hash에 인자로 암호화해줄 password와 salt를 인자로 넣어주면 끝이다.
  //-------------------------------------------------인증키--------------------------------------------------------------------
  const { authorization } = req.cookies;
  const [tokenType, authtoken] = authorization.split(' '); //토큰 타입은 bearer ,authtoken = authNum, secret_key
  const decodedToken = jwt.verify(authtoken, 'secret_key'); //jswt token 검증
  console.log(decodedToken.authNum); //이메일에 있는 authNum과 token값이 같다면 회원가입 진행 ---(입력칸이 필요함..)

  if (emailConfirm !== decodedToken.authNum) {
    return res.status(412).json({ errorMessage: '유효한 인증 키가 아닙니다.' });
  }
  if (!pattern.test(nickname)) {
    return res.status(412).json({
      errorMessage:
        '최소 3자 이상, 알파벳 대소문자(a~z, A~Z), 숫자(0~9)를 입력해주세요.',
    });
  }
  if (!(password.length >= 4 && nickname !== password)) {
    return res.status(412).json({
      errorMessage:
        '비밀번호는 최소 4자 이상이며, 닉네임과 같은 값이 포함되어서는 안됩니다.',
    });
  }
  if (isExistEmail) {
    return res.status(412).json({ errorMessage: '중복된 이메일 입니다.' });
  }
  if (isExistNick) {
    return res.status(412).json({ errorMessage: '중복된 닉네임 입니다.' });
  }
  if (!(email && nickname && password && confirm)) {
    return res
      .status(412)
      .json({ errorMessage: '데이터 형식이 올바르지 않습니다.' });
  }
  if (password !== confirm) {
    return res
      .status(412)
      .json({ errorMessage: '비밀번호가 일치하지 않습니다.' });
  }
  try {
    await User.create({ email, nickname, password: hash });
    return res.status(201).json({ message: '회원가입 되었습니다.' });
  } catch (error) {
    return res.status(400).json({ errorMessage: '회원가입에 실패하였습니다.' });
  }
});

// 로그인
router.post('/sginin', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });

  if (!(email && password)) {
    return res
      .status(412)
      .json({ errorMessage: '데이터 형식이 올바르지 않습니다.' });
  }

  try {
    if (!user) {
      return res
        .status(412)
        .json({ errorMessage: '이메일 또는 비밀번호를 확인해주세요.' });
    }
    const compareHash = await bcrypt.compare(
      password,
      user.dataValues.password
    ); // 암호화된 비밀번호와 입력 받은 password 비교하여 맞다면 true.

    if (compareHash) {
      const token = jwt.sign(
        {
          userId: user.dataValues.id,
        },
        'customized_secret_key'
      );
      res.cookie('authorization', `Bearer ${token}`);
      return res.status(200).json({ token: token }); //
    } else {
      return res
        .status(412)
        .json({ errorMessage: '이메일 또는 비밀번호를 확인해주세요.' }); //에러코드 확인 및 메시지
    }
  } catch (error) {
    return res.status(400).json({ errorMessage: '로그인에 실패하였습니다.' });
  }
});

//제거
router.delete('/a', async (req, res) => {
  const { email } = req.body;
  await User.destroy({ where: { email } });
  return res.json({ message: '제거 완료.' });
});
// 프로필 조회
router.get('/profile', authmiddleware, async (req, res) => {
  const id = req.userId;
  const userInfo = await User.findOne({ where: id });
  res.json({ userInfo });
  // console.log(id);
}); // 아이디가 로그인 되어 있으므로 이 조건식이 필요 없음 유저를 읽어오면 됨

//수정
router.put('/profile', authmiddleware, async (req, res) => {
  try {
    const id = req.userId;
    const { nickname, content } = req.body;

    if (!nickname) {
      return res.status(400).json({ message: '닉네임을 넣어주세요' });
    }
    if (!content) {
      return res.status(401).json({ message: '내용을 넣어주세요' });
    }
    await User.update({ nickname, content }, { where: { id } });
    return res.status(200).json({ message: '프로필이 수정되었습니다.' });
  } catch (error) {
    console.error('에러 발생:', error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router;
