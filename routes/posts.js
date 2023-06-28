const express = require('express');
const router = express.Router();
const { Posts } = require('../models/post.js');
const { Op } = require('sequelize');
// const authMiddleware = require('../middlewares/auth-middleware.js');
//import * as tweetController from '../controller/tweet.js';

// 사용할 속성
// title: DataTypes.STRING,
// content: DataTypes.STRING,
// userId: DataTypes.INTEGER,
// likes: DataTypes.INTEGER,

// 게시글 전체 조회
router.get('/', async (req, res) => {
  try {
    const posts = await Posts.findAll({
      attributes: ['id', 'title', 'content', 'createdAt', 'userId', 'likes'],
    });

    return res.status(200).json({ data: posts });
  } catch (error) {
    return res
      .status(400)
      .json({ errorMEssage: '게시글 조회에 실패하였습니다.' });
  }
});

// 게시글 상세 조회
router.get('/:postId', async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await Posts.findOne({
      attributes: ['id', 'title', 'content', 'createdAt', 'userId', 'likes'],
      where: { postId },
    });

    return res.status(200).json({ data: post });
  } catch (error) {
    return res
      .status(400)
      .json({ errorMEssage: '게시글 조회에 실패하였습니다.' });
  }
});

// 게시글 작성
router.post('/', async (req, res) => {
  // const { userId, password } = res.locals.user; authMiddleware 적용 이후 사용 예정
  // const { title, content } = req.body; authMiddleware 적용 이후 사용 예정
  const { title, content, password } = req.body; // authMiddleware 적용 이후 삭제 예정
  const post = await Posts.create({ title, content, password });

  // # 403 Cookie가 존재하지 않을 경우
  // {"errorMessage": "로그인이 필요한 기능입니다."}
  // if (!userId || !password) {
  //   res.status(403).json({ errorMessage: '로그인 후 사용 가능합니다.' });
  //   return;
  // } // authMiddleware 적용 이후 사용 예정

  if (!title) {
    res
      .status(412)
      .json({ errorMessage: '게시글 제목의 형식이 일치하지 않습니다.' });
    return;
  }

  if (!content) {
    res
      .status(412)
      .json({ errorMessage: '게시글 내용의 형식이 일치하지 않습니다.' });
    return;
  }

  try {
    res.status(201).json({ data: post }); // 게시글 작성 부분
  } catch (error) {
    return res
      .status(400)
      .json({ errorMEssage: '게시글 작성에 실패하였습니다.' });
  }
});

// 게시글 수정
router.put('/:postId', async (req, res) => {
  // const { userId, password } = res.locals.user; authMiddleware 적용 이후 사용 예정
  // const { title, content } = req.body; // authMiddleware 적용 이후 사용 예정
  const { postId } = req.params;
  const { title, content, password } = req.body; // authMiddleware 적용 이후 password 객체 삭제 제외 예정

  const post = await Posts.findOne({
    where: { postId: postId },
  });

  // # 403 Cookie가 존재하지 않을 경우
  // {"errorMessage": "로그인이 필요한 기능입니다."}
  // if (!userId || !password) {
  //   return res
  //     .status(403)
  //     .json({
  //       errorMessage:
  //         '게시글 수정 권한이 존재하지 않습니다. 로그인 후 사용 가능합니다.',
  //     });
  // } // authMiddleware 적용 후 사용 예정

  if (!post) {
    return res.status(404).json({
      errorMessage: '게시글이 존재하지 않습니다.',
    });
  }

  if (post.password !== password) {
    return res.status(401).json({
      message: '게시글의 비밀번호와, 전달받은 비밀번호가 일치하지 않습니다.',
    });
  } // authMiddleware 적용 후 삭제 예정

  if (!title) {
    res
      .status(412)
      .json({ errorMessage: '게시글 제목의 형식이 일치하지 않습니다.' });
    return;
  }

  if (!content) {
    res
      .status(412)
      .json({ errorMessage: '게시글 내용의 형식이 일치하지 않습니다.' });
    return;
  }

  try {
    await Posts.update(
      { title, content }, // 수정할 컬럼 및 데이터
      {
        where: {
          [Op.and]: [{ postId }, { password }], // authMiddleware 적용 이후 삭제 예정
        },
        // where:{[Op.and]: [{userId},{password}]} // authMiddleware 적용 이후 사용 예정
      }
    );

    return res.status(200).json({ message: '게시글이 수정되었습니다.' });
  } catch (error) {
    return res
      .status(400)
      .json({ errorMEssage: '게시글 수정에 실패하였습니다.' });
  }
});

// 게시글 삭제
router.delete('/:postId', async (req, res) => {
  // const { userId, password } = res.locals.user; authMiddleware 적용 이후 사용 예정
  const { postId } = req.params;
  const { password } = req.body; // authMiddleware 적용 이후 삭제 예정

  const post = await Posts.findOne({
    where: { postId: postId },
  });

  // # 403 Cookie가 존재하지 않을 경우
  // {"errorMessage": "로그인이 필요한 기능입니다."}
  // if (!userId || !password) {
  //   res.status(403).json({ errorMessage: '게시글의 삭제 권한이 존재하지 않습니다. 로그인 후 사용 가능합니다.' });
  //   return;
  // } // authMiddleware 적용 이후 사용 예정

  if (!post) {
    return res.status(404).json({
      errorMessage: '게시글이 존재하지 않습니다.',
    });
  }

  if (post.password !== password) {
    return res.status(401).json({
      message: '게시글의 비밀번호와, 전달받은 비밀번호가 일치하지 않습니다.',
    });
  } // authMiddleware 적용 이후 삭제 예정

  try {
    await Posts.destroy({
      where: {
        [Op.and]: [{ postId }, { password }], // authMiddleware 적용 이후 삭제 예정
      },
      // where:{[Op.and]: [{userId},{password}]} // authMiddleware 적용 이후 사용 예정
    });

    return res.status(200).json({ message: '게시글이 삭제되었습니다.' });
  } catch (error) {
    return res
      .status(400)
      .json({ errorMEssage: '게시글 삭제에 실패하였습니다.' });
  }
});

module.exports = router;
