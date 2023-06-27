const express = require('express');
const router = express.Router();
const { Comment } = require('../models');
const { User } = require('../models');
const { Op } = require('sequelize');
//import * as tweetController from '../controller/tweet.js';

router.get('/', (req, res, next) => {
  res.send('comments router');
});

//댓글 생성
router.post('/', async (req, res) => {
  const { content } = req.body;

  await Comment.create({
    content: content,
  });

  res.status(200).json({ content: content });
});

module.exports = router;

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

//수정
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const comment = await Comment.findOne({ where: { id } });
  await comment.update({
    content: content,
  });

  res.status(200).json({ content: content });
});

//삭제
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const comment = await Comment.findOne({ where: { id } });
  await comment.destroy({ id });

  res.status(200).json({ content: content });
});

module.exports = router;
