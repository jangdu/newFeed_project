const url = process.env.REACT_APP_BASE_URL;

const requestOptions = {
  method: 'GET', // HTTP 요청 메소드 (GET, POST 등)
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include', // 쿠키 포함 설정
};

export const getAllComments = async postId => {
  try {
    const response = await fetch(
      `${url}/api/comments/${postId}`,
      requestOptions
    );

    if (response.ok) {
      const data = await response.json();
      return await data.comment;
    } else {
      alert('로그인 실패');
      throw new Error('로그인에 실패했습니다.');
    }
  } catch (error) {
    console.error(error);
    // 에러 처리
  }
};

export const createComment = async (postId, content) => {
  try {
    const response = await fetch(`${url}/api/comments/${postId}`, {
      method: 'POST', // HTTP 요청 메소드 (GET, POST 등)
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // 쿠키 포함 설정
      body: JSON.stringify({ content }),
    });

    const data = await response.json();
    if (response.ok) {
      return '정상적으로 저장 되었습니다.';
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    // 에러 처리
    return error;
  }
};

export const updateComment = async (newComment, commentId) => {
  try {
    const response = await fetch(`${url}/api/comments/${commentId}`, {
      method: 'PUT', // HTTP 요청 메소드 (GET, POST 등)
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // 쿠키 포함 설정
      body: JSON.stringify(newComment),
    });

    const data = await response.json();
    if (response.ok) {
      return '정상적으로 저장 되었습니다.';
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    // 에러 처리
    return error;
  }
};

export const removeComment = async commentId => {
  try {
    const response = await fetch(`${url}/api/comments/${commentId}`, {
      method: 'DELETE', // HTTP 요청 메소드 (GET, POST 등)
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // 쿠키 포함 설정
    });

    const data = await response.json();
    if (response.ok) {
      return '정상적으로 저장 되었습니다.';
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    // 에러 처리
    return error;
  }
};
