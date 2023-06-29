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
router.get('/', async (req, res) => {
  const comment = await Comment.findAll({});

  res.status(200).json({ comment: comment });
});

//댓글 상세 조회
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const comment = await Comment.findOne({ where: { id } });

  res.status(200).json({ comment: comment });
});

//댓글 생성
router.post('/:postid', middleware, async (req, res) => {
  try {
    const { content } = req.body;
    const { postId } = req.params;
    const userId = req.userId;
    if (!content) {
      res.status(400).json({
        errorMessage: '댓글을 입력해주세요',
      });
    }

    // const post = await Post.findOne({ id: postId });

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
        'createdAt',
        'updatedAt',
      ],
      where: { id: postId },
      order: [['createdAt', 'DESC']],
    });
    console.log(post);
    const comment = await Comment.create({
      content: content,
      postid: post.id,
      userId: userId,
    });
    res.status(200).json({ comment });
  } catch (error) {
    res.status(500).json({
      errorMessage: '서버 오류',
    });
  }
});

//수정
router.put('/:id', middleware, async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const comment = await Comment.findOne({ where: { id } });
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
});

//삭제
router.delete('/:id', middleware, async (req, res) => {
  const { id } = req.params;
  const comment = await Comment.findOne({ id });
  if (!comment) {
    res.status(400).json({
      errorMessage: '댓글이 삭제되었거나 존재하지 않습니다.',
    });
  }
  await comment.destroy({});

  res.status(200).json({ success: '댓글이 삭제되었습니다.' });
});

module.exports = router;
