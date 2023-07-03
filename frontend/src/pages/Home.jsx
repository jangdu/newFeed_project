import React, { useEffect, useState } from 'react';
import { getAllPost } from '../api/post';
import Loding from '../components/Loding';
import PostCard from '../components/PostCard';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const data = await getAllPost();
      setPosts(prevPosts => [...data]);
      setIsLoading(false);
    }

    fetchData();
  }, []);
  if (isLoading) {
    return <Loding></Loding>;
  } else {
    if (posts.length > 0)
      return (
        <div>
          {posts.map(postData => {
            return <PostCard key={postData.id} postData={postData} />;
          })}
        </div>
      );
    else return <div>No Post</div>;
  }
}
