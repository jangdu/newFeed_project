import React, { useState } from 'react';

const Signup = () => {
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');
  const [imgUrl, setImgUrl] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if (password !== confirm) {
      alert('비빌번호와 확인이 다름');
      setPassword('');
      setConfirm('');
      return;
    }
  };

  return (
    <div>
      <h2 className="font-bold mb-4">회원가입</h2>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="사용자명"
          value={nickname}
          onChange={e => setNickname(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호 확인"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
        />
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="한줄 자기소개"
          value={comment}
          onChange={e => setComment(e.target.value)}
        />
        <input
          type="email"
          placeholder="프로필 이미지"
          value={imgUrl}
          onChange={e => setImgUrl(e.target.value)}
        />
        <button type="submit">회원가입</button>
      </form>
    </div>
  );
};

export default Signup;
