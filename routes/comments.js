const express = require('express');
const router = express.Router();
const { Comment, Post, User } = require('../models');
const { Op } = require('sequelize');
const middleware = require('../middlewares/middleware.js');

//import * as tweetController from '../controller/tweet.js';
// router.get('/', (req, res, next) => {
//   res.send('comments router');
// });

//댓글 생성
router.post('/', async (req, res) => {
  // const { postid } = req.params;
  // const { userid } = req.params;
  //  const user = await User.findOne({ where: { id: userid } });

  const { content, postid, userid } = req.body;
  const comment = await Comment.create({
    content: content,
  });
  res.status(200).json({ comment });
});
// if (!userId) {
//   res.status(400).json({
//     errorMessage: '로그인이 필요한 기능입니다.',
//   });
// }

// try {
//   const user = await User.findOne({
//     attributes: [`id`, `nickname`, `email`, 'password'],
//     where: { id },
//   });
//   console.log(user);
//   if (!user) {
//     res.status(400).json({
//       errorMessage: '존재하지 않는 사용자 입니다.',
//     });
//   }
// } catch (error) {}
// const comment = await Comment.create({
//   content: content,
//   userId: user.userId,
// });

// } catch (error) {
//   console.error(error);
//   res.status(500).json({
//     errorMessage: '서버 오류',
//   });
// }

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
    updateAt: Date.now,
  });

  res.status(200).json({ comment });
});

//삭제
router.delete('/:id', async (req, res) => {
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
