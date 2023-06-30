import React, { useEffect, useState } from 'react';
import Loding from './Loding';
import { createComment, getAllComments } from '../api/comment';
import CommentCard from './CommentCard';
import Button from './ui/Button';
import { getMyUserId } from '../api/auth';
import Cookies from 'js-cookie';

export default function Comment({ postId, userId }) {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUpLoading] = useState(false);

  const [newComment, setNewComment] = useState({});

  async function fetchData() {
    const data = await getAllComments(postId);
    setComments(precomment => [...data]);
    return await setIsLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    setIsUpLoading(true);
    // await setNewPost({ ...newPost });
    // await addNewPost(newPost);
    // await create(newPost);
    console.log(newComment.content);
    alert(await createComment(postId, newComment.content));
    setNewComment('');
    fetchData();
    setIsUpLoading(false);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setNewComment(input => ({ ...input, [name]: value }));
  };

  return (
    <div className="w-full rounded-md border p-4">
      <h1 className="font-bold text-xl mx-auto text-center mb-4">댓글 입력</h1>
      <form
        className="flex flex-row w-full justify-between text-lg mx-auto"
        onSubmit={handleSubmit}
      >
        <input
          rows={1}
          className="p-4 my-4 rounded-md resize-none w-[80%] focus:border-none focus:outline-none"
          placeholder="내용을 입력하세요"
          name="content"
          value={newComment.content ?? ''}
          onChange={handleChange}
          disabled={userId ? false : true}
          required
        />
        <div className="h-fit my-auto mx-4">
          <Button
            text={isUploading ? 'uploading...' : '저장'}
            disabled={isUploading}
          />
        </div>
      </form>
      {(isLoading && <Loding />) ||
        (!isLoading &&
          comments.length > 0 &&
          comments.map(comment => {
            return (
              <div key={comment.id}>
                <CommentCard
                  commentData={comment}
                  userId={userId}
                  fetchData={fetchData}
                />
              </div>
            );
          })) ||
        (!isLoading && comments.length === 0 && <p></p>)}
    </div>
  );
}
