const express = require('express');
const { User } = require('../models');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const router = express.Router();
require('dotenv').config();

//import * as tweetController from '../controller/tweet.js';

// 이메일 인증 body에 email 값 받으면 내 email에서 해당 email로 인증코드 전송.
router.post('/email', async (req, res) => {
  const { email } = req.body;
  const authNum = Math.random().toString(18).substr(2, 6);
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

  await transporter.sendMail({
    from: `"11조 👻" <${process.env.NODEMAILER_USER}>`,
    to: email,
    subject: 'Hello 이메일 인증 요청 ✔', // Subject line
    text: 'Hello world?', // plain text body
    html: `<h1>${authNum}</h1>`, // html body
  });
  res.cookie('authorization', `Bearer ${authtoken}`);
  return res.json({ message: '이메일 인증키 발송' });
});

// 회원가입
router.post('/sginup', async (req, res) => {
  const { email, nickname, password, confirm } = req.body;
  const pattern = new RegExp('^[a-zA-Z][0-9a-zA-Z]{2,}$'); //조건 정규식
  const isExistUser = await User.findOne({ where: { nickname } });
  //------------------------------------------------암호화----------------------------------------------------------------------
  const salt = await bcrypt.genSalt(10); // 값이 높을 수록 암호화 연산이 증가. 하지만 암호화하는데 속도가 느려진다.
  const hash = await bcrypt.hash(password, salt); //bcrypt.hash에 인자로 암호화해줄 password와 salt를 인자로 넣어주면 끝이다.
  //-------------------------------------------------인증키--------------------------------------------------------------------
  const { authorization } = req.cookies;
  const [tokenType, authtoken] = authorization.split(' '); //토큰 타입은 bearer ,authtoken = authNum, secret_key
  const decodedToken = jwt.verify(authtoken, 'secret_key'); //jswt token 검증
  console.log(decodedToken.authNum); //이메일에 있는 authNum과 token값이 같다면 회원가입 진행 ---(입력칸이 필요함..)

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
  if (isExistUser) {
    return res.status(412).json({ errorMessage: '중복된 닉네임 입니다.' });
  }
  if (!(email || nickname || password || confirm)) {
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
    return res.status(200).json({ message: '회원가입 되었습니다.' });
  } catch (error) {
    return res
      .status(400)
      .json({ errorMessage: '요청한 데이터 형식이 올바르지 않습니다.' });
  }
});

// 로그인
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  const compareHash = await bcrypt.compare(password, user.password); // 암호화된 비밀번호와 입력 받은 password 비교하여 맞다면 true.
  if (!user.email) {
    return res
      .status(200)
      .json({ errorMessage: '이메일이 존재하지 않습니다.' });
  }
  if (!(email && password)) {
    return res
      .status(400)
      .json({ errorMessage: '데이터 형식이 올바르지 않습니다.' });
  }
  try {
    if (compareHash) {
      const token = jwt.sign(
        {
          userId: user.id,
        },
        'customized_secret_key'
      );
      res.cookie('authorization', `Bearer ${token}`);
      return res.status(200).json({ token: token }); //
    } else {
      return res
        .status(400)
        .json({ errorMessage: '이메일 혹은 비밀번호가 다릅니다.' }); //에러코드 확인 및 메시지
    }
  } catch (error) {
    return res.status(400).json({ errorMessage: '로그인에 실패하였습니다..' });
  }
});

//제거
router.post('/sginin', async (req, res) => {
  const { email } = req.body;
  await User.destroy({ where: { email } });
  return res.json({ message: '제거 완료.' });
});

// 자기소개 및 닉네임
router.get('//:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    // const { nickname, content } = req.body;
    const userInfo = await User.findOne({
      where: { userId: userId },
      attributes: ['nickname', 'content'], //url??
    });

    if (!userInfo) {
      return res
        .status(404)
        .json({ message: '검색된 유저가 존재하지 않습니다.' });
    }

    return res.status(200).json({
      userInfo,
      message: '검색한 유저 결과입니다.',
    });
  } catch (error) {
    console.error('에러 발생:', error); // 에러 로깅
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

router.put('/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { nickname, content, password } = req.body;

    const user = await User.findOne({ where: { userId } });

    if (!user) {
      return res.status(400).json({
        message: '사용자 정보가 없습니다.',
      });
    } else if (user.password !== password) {
      return res.status(401).json({
        message: '수정 권한이 없습니다.',
      });
    }
    // 프로필 수정
    await user.update({ nickname, content }, { where: { userId, password } });
    // 수정할 컬럼 및 데이터      프로필 아이디와 비밀번호가 일치할 때 수정
    return res.status(200).json({ message: '프로필이 수정되었습니다.' });
  } catch (error) {
    console.error('에러 발생:', error); // 에러 로깅
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router;
