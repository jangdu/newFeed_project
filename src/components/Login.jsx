import React, { useState } from 'react';
import { loginUser } from '../api/auth';

const Login = () => {
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    console.log(nickname);
    loginUser(nickname, password);
  };

  return (
    <div>
      <h2 className="mb-5">로그인</h2>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          id="nickname"
          type="text"
          placeholder="닉네임"
          value={nickname}
          onChange={e => setNickname(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit">로그인</button>
      </form>
    </div>
  );
};

export default Login;
