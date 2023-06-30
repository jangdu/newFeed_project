const express = require('express');
const router = express.Router();
const { User, Post } = require('../models');
const { Op } = require('sequelize');
const authMiddleware = require('../middlewares/middleware');
//import * as tweetController from '../controller/tweet.js';

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

      attributes: ['id', 'userId', 'title', 'createdAt', 'updatedAt'],
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({ data: posts });
  } catch (error) {
    return res
      .status(400)
      .json({ errorMessage: '게시글 조회에 실패하였습니다.' });
  }
});

// 게시글 상세 조회
router.get('/:postId', async (req, res) => {
  const { postId } = req.params;

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

    if (post === null) {
      return res
        .status(404)
        .json({ errorMessage: '존재하지 않는 게시글입니다.' });
    }

    return res.status(200).json({ data: post });
  } catch (error) {
    return res
      .status(400)
      .json({ errorMessage: '게시글 조회에 실패하였습니다.' });
  }
});

// 게시글 작성
router.post('/', authMiddleware, async (req, res) => {
  const userId = req.userId;
  const { title, content } = req.body;

  if (!userId) {
    res.status(403).json({ errorMessage: '로그인 후 사용 가능합니다.' });
    return;
  }

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
    res.status(201).json({ data: post });
  } catch (error) {
    return res
      .status(400)
      .json({ errorMessage: '게시글 작성에 실패하였습니다.' });
  }
});

// 게시글 수정
router.put('/:postId', authMiddleware, async (req, res) => {
  const userId = req.userId;
  const { postId } = req.params;
  const { title, content } = req.body;

  const post = await Post.findOne({
    where: { id: postId },
    attributes: ['id', 'title', 'content', 'createdAt', 'userId', 'likes'],
  });

  if (post === null) {
    return res
      .status(404)
      .json({ errorMessage: '존재하지 않는 게시글입니다.' });
  }

  if (!userId) {
    return res.status(403).json({
      errorMessage:
        '게시글 수정 권한이 존재하지 않습니다. 로그인 후 사용 가능합니다.',
    });
  }

  if (!post) {
    return res.status(404).json({
      errorMessage: '게시글이 존재하지 않습니다.',
    });
  }

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
      { title, content }, // 수정할 컬럼?
      {
        // 누구를? 어떤걸?
        where: { id: postId },
        attributes: ['id', 'title', 'content', 'createdAt', 'userId', 'likes'],
      }
    );

    return res.status(200).json({ message: '게시글이 수정되었습니다.' });
  } catch (error) {
    return res
      .status(400)
      .json({ errorMessage: '게시글 수정에 실패하였습니다.' });
  }
});

// 게시글 삭제
router.delete('/:postId', authMiddleware, async (req, res) => {
  const userId = req.userId;
  const { postId } = req.params;

  const post = await Post.findOne({
    where: { id: postId },
    attributes: ['id', 'title', 'content', 'createdAt', 'userId', 'likes'],
  }); // attributes가 필요할지 다시 확인할 것, 삭제는 아래 Post.destroy에서 할 것이고, 지금 변수 선언 post는 게시글의 유무를 확인하기 위한 용도니까 필요 없을 것 같음.

  if (!post) {
    return res.status(404).json({
      errorMessage: '게시글이 존재하지 않습니다.',
    });
  }

  if (!userId) {
    return res.status(403).json({
      errorMessage:
        '게시글의 삭제 권한이 존재하지 않습니다. 로그인 후 사용 가능합니다.',
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
      .json({ errorMessage: '게시글 삭제에 실패하였습니다.' });
  }
});

module.exports = router;
