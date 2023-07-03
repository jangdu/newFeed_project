import React, { useEffect, useState } from 'react';
import Loding from '../components/Loding';
import { getMyProfile, updateMyProfile } from '../api/auth';
import Button from '../components/ui/Button';

const MyProfile = () => {
  const [user, setUser] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const onClickPutBtn = async () => {
    const inputNickname = prompt('변경 할 닉네임 : ');
    const inputContent = prompt('변경 할 한 줄 소개 : ');
    let newProfile = {};
    if (inputNickname && inputContent) {
      // 입력된 값이 있는 경우 처리
      try {
        newProfile.nickname = inputNickname;
        newProfile.content = inputContent;
        console.log(newProfile);
        await updateMyProfile(newProfile);

        alert('수정완료');
        window.location.reload();
      } catch (error) {
        alert('실패');
      }
    } else {
      // 입력된 값이 없는 경우 처리
      console.log('No user input.');
    }
  };

  useEffect(() => {
    async function fetchData() {
      const data = await getMyProfile();
      setUser(prevUser => data);
      setIsLoading(false);
    }

    fetchData();
  }, []);

  if (isLoading) {
    return <Loding></Loding>;
  } else {
    if (user)
      return (
        <section className="flex flex-col p-4 w-full">
          <div className="w-[80%] min-w-xl mx-auto">
            <div className="flex items-center mt-4 justify-between">
              <h1 className="text-2xl font-bold mt-6">
                {user.nickname}님의 정보
              </h1>
              <Button text="수정" onClick={onClickPutBtn} />
            </div>
            <p className="text-lg font-bold px-2 my-4 max-w-fit text-slate-800">
              이메일 : {user.email}
            </p>
            <p className="text-lg font-bold px-2 my-4 max-w-fit text-slate-800">
              가입일 : {user.createdAt.substring(0, 10)}
            </p>
            <p className="text-lg font-bold px-2 my-4 max-w-fit text-slate-800">
              한줄 소개 : {user.content}
            </p>
            <div className="w-60 border-2 border-gray-500 mt-4 mb-8 self-center" />
          </div>
        </section>
      );
    else return <div>No Post</div>;
  }
};
export default MyProfile;
