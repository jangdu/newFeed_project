import React, { useEffect, useState } from 'react';
import { getByPostId } from '../api/post';
import { useParams } from 'react-router-dom';
import Loding from '../components/Loding';

export default function PostDetail() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data } = await getByPostId(postId);
      setPost(data);
      setIsLoading(false);
    }

    fetchData();
  }, [postId]);

  if (isLoading) {
    return <Loding />;
  } else {
    return (
      <section className="flex flex-col p-4 w-full">
        <div className="w-full max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mt-6">{post.title}</h1>
          <div className="flex items-center mt-4 justify-between">
            <p className="text-lg font-bold px-2 my-4 max-w-fit text-slate-800">
              {post.User.nickname}
            </p>
            <p className="font-bold ml-2">{post.createdAt.substring(0, 10)}</p>
          </div>
          <div className="w-60 border-2 border-gray-500 mt-4 mb-8 self-center" />
          <p className="text-xl p-4 font-semibold">{post.content}</p>
          {/* <MarkdownViewer content={post.content} />
            <Comment id={post.id} /> */}
        </div>
      </section>
    );
  }
}
