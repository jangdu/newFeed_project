import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PostCard({
  postData: {
    title,
    id,
    content,
    likes,
    createdAt,
    userId,
    User: { nickname },
  },
}) {
  const navigate = useNavigate();
  return (
    <div className="w-[80%] mx-auto max-w-2xl border-b my-4 border-slate-500 overflow-hidden">
      <div className="mt-2 px-2 flex justify-between items-center mb-2">
        <h3
          onClick={() => {
            navigate(`/post/${id}`);
          }}
          className="truncate text-xl font-bold max-w-md cursor-pointer border-white border-4 transition delay-150 bg-white hover:border-b-green-300 duration-300"
        >
          {title}
        </h3>
      </div>

      <div>
        <p className="m-2 text-md text-black font-semibold">{nickname}</p>
        <p className="m-2 text-sm text-black font-semibold">❤️ {likes}</p>
        <p className="mx-2 py-6 text-gray-500">{createdAt.substring(0, 10)}</p>
      </div>
    </div>
  );
}
