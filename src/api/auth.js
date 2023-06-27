const TOKEN = 'token';
const url = process.env.REACT_APP_BASE_URL;

export const loginUser = async (nickname, password) => {
  try {
    const response = await fetch(`${url}/api/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nickname, password }),
    });

    if (response.ok) {
      const { token } = await response.json();
      localStorage.setItem(TOKEN, token);
    } else {
      alert('로그인 실패');
      throw new Error('로그인에 실패했습니다.');
    }
  } catch (error) {
    console.error(error);
    // 에러 처리
  }
};
