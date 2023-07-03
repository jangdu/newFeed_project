import React, { useEffect, useState } from 'react';
import Button from '../components/ui/Button';
import { create } from '../api/post';
import Cookies from 'js-cookie';
// import { addNewPost } from '../api/post';

export default function NewPost() {
  const [newPost, setNewPost] = useState({});
  const [isUploading, setIsUpLoading] = useState(false);
  useEffect(() => {
    if (!Cookies.get('authorization')) {
      alert('로그인된 사용자만 이용 가능 합니다.');
      window.location.href = '/'; // 홈 경로로 이동
    }
  }, []);

  const handleResizeHeight = e => {
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
    handleChange(e);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setNewPost(post => ({ ...post, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsUpLoading(true);
    // await setNewPost({ ...newPost });
    // await addNewPost(newPost);
    await create(newPost);
    alert('정상적으로 저장 되었습니다.');
    window.location.href = '/'; // 홈 경로로 이동
    setIsUpLoading(false);
  };
  return (
    <section className="p-4 flex w-full mx-auto">
      {isUploading && <p>업로드중 ... </p>}
      <form
        className="flex flex-col text-lg w-[80vw] max-w-xl mx-auto"
        onSubmit={handleSubmit}
      >
        <h1 className="font-bold text-3xl mx-auto mb-4">글쓰기</h1>
        <input
          className="p-2"
          type="text"
          placeholder="title"
          name="title"
          value={newPost.title ?? ''}
          required
          onChange={handleChange}
        />
        <textarea
          rows={1}
          className="p-4 my-4 resize-none focus:border-none focus:outline-none"
          placeholder="내용을 입력하세요"
          name="content"
          value={newPost.content ?? ''}
          onChange={handleResizeHeight}
          required
        />
        <div className="fixed font-bold bottom-0 right-28 h-16 ">
          <Button
            text={isUploading ? 'uploading...' : '저장'}
            disabled={isUploading}
          />
        </div>
      </form>
    </section>
  );
}
