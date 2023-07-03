const url = process.env.REACT_APP_BASE_URL;
const requestOptions = {
  method: 'GET', // HTTP 요청 메소드 (GET, POST 등)
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include', // 쿠키 포함 설정
};

export const getAllPost = async () => {
  try {
    const response = await fetch(`${url}/api/posts`, requestOptions);

    if (response.ok) {
      const data = await response.json();
      return await data.data;
    } else {
      alert('로그인 실패');
      throw new Error('로그인에 실패했습니다.');
    }
  } catch (error) {
    console.error(error);
    // 에러 처리
  }
};

export const getByPostId = async postId => {
  try {
    const response = await fetch(`${url}/api/posts/${postId}`, requestOptions);

    if (response.ok) {
      return await response.json();
      //return await data;
    } else {
      alert('게시글이 존재하지 않습니다.');
      window.location.href = '/';
      throw new Error('게시글 조회 실패');
    }
  } catch (error) {
    console.error(error);
    // 에러 처리
  }
};

export const create = async newPost => {
  try {
    const response = await fetch(`${url}/api/posts/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // 쿠키 포함 설정
      body: JSON.stringify(newPost),
    });

    if (response.ok) {
      return await response.json();
    } else {
      alert('게시글 조회 실패');
      throw new Error('게시글 조회 실패');
    }
  } catch (error) {
    console.error(error);
    // 에러 처리
  }
};

export const updatePost = async (newPost, postId) => {
  try {
    const response = await fetch(`${url}/api/posts/${postId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // 쿠키 포함 설정
      body: JSON.stringify(newPost),
    });

    if (response.ok) {
      return await response.json();
    } else {
      alert('게시글 조회 실패');
      throw new Error('게시글 조회 실패');
    }
  } catch (error) {
    console.error(error);
    // 에러 처리
  }
};

export const removePost = async postId => {
  try {
    const response = await fetch(`${url}/api/posts/${postId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // 쿠키 포함 설정
    });

    if (response.ok) {
      alert('게시글 삭제 완료');
      window.location.href = '/';
      return await response.json();
    } else {
      alert('게시글 삭제 실패');
      throw new Error('게시글 조회 실패');
    }
  } catch (error) {
    console.error(error);
    // 에러 처리
  }
};
