import Cookies from 'js-cookie';

//const TOKEN = 'token';
const url = process.env.REACT_APP_BASE_URL;

export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${url}/api/user/sginin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const { token } = await response.json();
      Cookies.set('authorization', `Bearer ${token}`, { expires: 1 });
      window.location.reload();
    } else {
      alert('로그인 실패');
      throw new Error('로그인에 실패했습니다.');
    }
  } catch (error) {
    console.error(error);
    // 에러 처리
  }
};

export const signupUser = async (
  nickname,
  password,
  confirm,
  email,
  emailConfirm,
  comment,
  imgUrl
) => {
  try {
    const response = await fetch(`${url}/api/user/sginup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nickname,
        password,
        confirm,
        email,
        emailConfirm,
        comment,
        imgUrl,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      alert(data.message);
      window.location.reload();
    } else {
      alert(data.errorMessage);
      throw new Error('로그인에 실패했습니다.');
    }
  } catch (error) {
    console.error(error);
    // 에러 처리
  }
};

export const onclickEmailConfirmBtn = async email => {
  try {
    const response = await fetch(`${url}/api/user/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    console.log(data);
    if (response.ok) {
      alert(data.message);
    } else {
      alert(data.errorMessage);
    }
  } catch (error) {
    console.error(error);
    // 에러 처리
  }
};
