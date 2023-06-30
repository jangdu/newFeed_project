const express = require('express');
const router = express.Router();
const { Comment, Post, User } = require('../models');
const { Op } = require('sequelize');
const middleware = require('../middlewares/middleware.js');

//import * as tweetController from '../controller/tweet.js';
// router.get('/', (req, res, next) => {
//   res.send('comments router');
// });

//댓글 조회
router.get('/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    console.log(postId);
    const comment = await Comment.findAll({
      include: {
        model: User,
        attributes: ['id', 'nickname'],
      },
      where: { postId },
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({ postId, comment });
  } catch (error) {
    res.status(500).json({
      errorMessage: '서버 오류',
    });
  }
});

//댓글 생성
router.post('/:postId', middleware, async (req, res) => {
  try {
    const { content } = req.body;
    const { postId } = req.params;
    const userId = req.userId;
    if (!content) {
      res.status(400).json({
        errorMessage: '댓글을 입력해주세요',
      });
    }

    const comment = await Comment.create({
      content,
      postId,
      userId,
    });
    res.status(200).json({ comment });
  } catch (error) {
    res.status(500).json({
      errorMessage: '서버 오류',
    });
  }
});

//수정
router.put('/:commentId', middleware, async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const comment = await Comment.findOne({ where: { id: commentId } });
    if (!comment) {
      res.status(400).json({
        errorMessage: '존재하지 않는 댓글입니다.',
      });
    }
    await comment.update({
      content: content,
      updateAt: Date.now,
    });

    res.status(200).json({ comment });
  } catch (error) {
    res.status(500).json({
      errorMessage: '서버 오류',
    });
  }
});

//삭제
router.delete('/:commentId', middleware, async (req, res) => {
  try {
    const { commentId } = req.params;

    console.log('******************');
    console.log(commentId);
    const comment = await Comment.findOne({ Where: { id: commentId } });
    if (!comment) {
      res.status(400).json({
        errorMessage: '댓글이 삭제되었거나 존재하지 않습니다.',
      });
    }
    await Comment.destroy({ where: { id: commentId } });

    res.status(200).json({ success: '댓글이 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({
      errorMessage: '서버 오류',
    });
  }
});

module.exports = router;
