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
      throw new Error();
    }
  } catch (error) {
    alert(error);
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
      throw new Error('로그인에 실패했습니다.');
    }
  } catch (error) {
    alert(error);
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
    if (response.ok) {
      alert(data.message);
    } else {
      alert(data.errorMessage);
    }
  } catch (error) {
    alert(error);
    // 에러 처리
  }
};

export const getMyProfile = async () => {
  const requestOptions = {
    method: 'GET', // HTTP 요청 메소드 (GET, POST 등)
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // 쿠키 포함 설정
  };

  try {
    const response = await fetch(`${url}/api/user/profile`, requestOptions);
    if (response.ok) {
      const { userInfo } = await response.json();
      return await userInfo;
    } else {
      alert(response.errorMessage);
      throw new Error('로그인에 실패했습니다.');
    }
  } catch (error) {
    console.error(error);
    alert(error);
    // 에러 처리
  }
};

export const updateMyProfile = async newProfile => {
  const requestOptions = {
    method: 'PUT', // HTTP 요청 메소드 (GET, POST 등)
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // 쿠키 포함 설정
    body: JSON.stringify(newProfile),
  };

  try {
    const response = await fetch(`${url}/api/user/profile`, requestOptions);
    if (response.ok) {
      const { userInfo } = await response.json();
      return await userInfo;
    } else {
      alert(response.errorMessage);
      throw new Error('로그인에 실패했습니다.');
    }
  } catch (error) {
    console.error(error);
    alert(error);
    // 에러 처리
  }
};
