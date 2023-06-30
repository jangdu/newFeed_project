import React from 'react';
import Button from './ui/Button';
import { removeComment, updateComment } from '../api/comment';

export default function CommentCard({ commentData, userId, fetchData }) {
  const onClickUpdateBtn = async () => {
    const inputContent = prompt('변경 할 글 내용 : ');
    let newComment = {};
    if (inputContent) {
      // 입력된 값이 있는 경우 처리
      try {
        newComment.content = inputContent;
        console.log(newComment);

        await updateComment(newComment, commentData.id);

        alert('수정완료');
        fetchData();
      } catch (error) {
        alert('실패');
      }
    } else {
      // 입력된 값이 없는 경우 처리
      console.log('No user input.');
    }
  };
  const onClickDeleteBtn = () => {
    removeComment(commentData.id);
    alert('삭제완료');
    fetchData();
  };

  return (
    <div className="w-[80%] mx-auto max-w-2xl border-b my-4 border-slate-500 overflow-hidden">
      <div className="mt-2 px-2 flex justify-between items-center mb-2">
        <h3 className="truncate text-xl font-bold max-w-md cursor-pointer border-white border-4 transition delay-150 bg-white hover:border-b-green-300 duration-300">
          {commentData.content}
        </h3>
      </div>

      <div>
        <p className="m-2 text-md text-black font-semibold">
          {commentData.User.nickname}
        </p>
        {/* <p className="m-2 text-sm text-black font-semibold">❤️ {likes}</p> */}
        <div className="flex flex-row justify-between">
          <p className="mx-2 py-6 text-gray-500">
            {commentData.createdAt.substring(0, 10)}
          </p>

          {userId && (
            <div className="h-fit my-auto mx-4">
              <Button text={'수정'} onClick={onClickUpdateBtn} />
              <Button text={'삭제'} onClick={onClickDeleteBtn} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
