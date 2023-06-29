const express = require('express');
const router = express.Router();
const { User, Post } = require('../models');
const { Op } = require('sequelize');
const authMiddleware = require('../middlewares/middleware');
//import * as tweetController from '../controller/tweet.js';

// 사용할 속성
// title: DataTypes.STRING,
// content: DataTypes.STRING,
// userId: DataTypes.INTEGER,
// likes: DataTypes.INTEGER,

// 게시글 전체 조회
router.get('/', async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ['nickname'],
        },
      ],

      attributes: [
        'id',
        'userId',
        'title',
        'content',
        'likes',
        'createdAt',
        'updatedAt',
      ],
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({ data: posts });
  } catch (error) {
    return res
      .status(400)
      .json({ errorMessage: '게시글 조회에 실패하였습니다.' });
  }
});

// before
// router.get('/', async (req, res) => {
//   try {
//     const posts = await Post.findAll({
//       attributes: ['id', 'title', 'content', 'createdAt', 'userId', 'likes'],
//     });

//     return res.status(200).json({ data: posts });
//   } catch (error) {
//     return res
//       .status(400)
//       .json({ errorMessage: '게시글 조회에 실패하였습니다.' });
//   }
// });

// 게시글 상세 조회
router.get('/:postId', async (req, res) => {
  const { postId } = req.params;

  // 일치하지 않는 id:postId는 id를 재확인해달라는 에러 리턴 추가 필요
  // !isExistId.length 하는 식으로 하면 될 것 같음

  try {
    const post = await Post.findOne({
      include: [
        {
          model: User,
          attributes: ['nickname'],
        },
      ],
      attributes: [
        'id',
        'userId',
        'title',
        'content',
        'likes',
        'createdAt',
        'updatedAt',
      ],
      where: { id: postId },
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({ data: post });
  } catch (error) {
    return res
      .status(400)
      .json({ errorMEssage: '게시글 조회에 실패하였습니다.' });
  }
});

// before
// router.get('/:postId', async (req, res) => {
//   const { postId } = req.params;

//   // 일치하지 않는 id:postId는 id를 재확인해달라는 에러 리턴 추가 필요

//   try {
//     const post = await Post.findOne({
//       attributes: ['id', 'title', 'content', 'createdAt', 'userId', 'likes'],
//       where: { id: postId },
//     });

//     return res.status(200).json({ data: post });
//   } catch (error) {
//     return res
//       .status(400)
//       .json({ errorMEssage: '게시글 조회에 실패하였습니다.' });
//   }
// });

// 게시글 작성
router.post('/', authMiddleware, async (req, res) => {
  const userId = req.userId; // authMiddleware 적용 이후 사용 예정
  const { title, content } = req.body; // authMiddleware 적용 이후 사용 예정
  // const { title, content, userId } = req.body; // authMiddleware 적용 이후 삭제 예정

  if (!userId) {
    res.status(403).json({ errorMessage: '로그인 후 사용 가능합니다.' });
    return;
  } // authMiddleware 적용 이후 사용 예정

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
    const post = await Post.create({ title, content, userId });
    res.status(201).json({ data: post }); // 게시글 작성 부분
  } catch (error) {
    return res
      .status(400)
      .json({ errorMEssage: '게시글 작성에 실패하였습니다.' });
  }
});

// 게시글 수정
router.put('/:postId', authMiddleware, async (req, res) => {
  const userId = req.userId; // authMiddleware 적용 이후 사용 예정
  const { postId } = req.params;
  const { title, content } = req.body;

  const post = await Post.findOne({
    where: { id: postId },
    attributes: ['id', 'title', 'content', 'createdAt', 'userId', 'likes'],
  });

  // # 403 Cookie가 존재하지 않을 경우
  // {"errorMessage": "로그인이 필요한 기능입니다."}
  if (!userId) {
    return res.status(403).json({
      errorMessage:
        '게시글 수정 권한이 존재하지 않습니다. 로그인 후 사용 가능합니다.',
    });
  } // authMiddleware 적용 후 사용 예정

  if (!post) {
    return res.status(404).json({
      errorMessage: '게시글이 존재하지 않습니다.',
    });
  }
  // 일치하지 않는 게시글번호에 대한 에러 리턴 추가 필요

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
    await Post.update(
      { title, content }, // 수정할 컬럼 및 데이터
      {
        where: { id: postId },
        attributes: ['id', 'title', 'content', 'createdAt', 'userId', 'likes'],
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
router.delete('/:postId', authMiddleware, async (req, res) => {
  const userId = req.userId; // authMiddleware 적용 이후 사용 예정
  const { postId } = req.params;

  const post = await Post.findOne({
    // where: { id: postId }, // authMiddleware 적용 이후 삭제 예정
    attributes: ['id', 'title', 'content', 'createdAt', 'userId', 'likes'],
  });

  // # 403 Cookie가 존재하지 않을 경우
  // {"errorMessage": "로그인이 필요한 기능입니다."}
  if (!userId || !password) {
    res.status(403).json({
      errorMessage:
        '게시글의 삭제 권한이 존재하지 않습니다. 로그인 후 사용 가능합니다.',
    });
    return;
  } // authMiddleware 적용 이후 사용 예정

  if (!post) {
    return res.status(404).json({
      errorMessage: '게시글이 존재하지 않습니다.',
    });
  }

  try {
    await Post.destroy({
      where: { id: postId },
      attributes: ['id', 'title', 'content', 'createdAt', 'userId', 'likes'],
    });

    return res.status(200).json({ message: '게시글이 삭제되었습니다.' });
  } catch (error) {
    return res
      .status(400)
      .json({ errorMEssage: '게시글 삭제에 실패하였습니다.' });
  }
});

module.exports = router;
