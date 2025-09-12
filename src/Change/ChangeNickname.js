// ChangeNickname.js
import React, { useState } from "react";
import api from "../Api/api"; // ✅ api.js에서 정의한 axios 인스턴스 가져오기

function ChangeNickname() {
  const [nickname, setNickname] = useState("");
  const [message, setMessage] = useState("");

  const handleChangeNickname = async (e) => {
    e.preventDefault();

    try {
      // api.js에 정의된 인스턴스를 사용해서 요청
      const res = await api.patch("/members/me/nickname", {
        nickname: nickname,
      });

      if (res.status === 200) {
        setMessage("정상적으로 변경되었습니다.");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setMessage("에러가 발생하였습니다.");
      } else {
        setMessage("서버와의 통신 중 문제가 발생했습니다.");
      }
    }
  };

  return (
    <div style={{ margin: "20px" }}>
      <h2>닉네임 변경</h2>
      <form onSubmit={handleChangeNickname}>
        <input
          type="text"
          value={nickname}
          placeholder="새 닉네임 입력"
          onChange={(e) => setNickname(e.target.value)}
        />
        <button type="submit">변경</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default ChangeNickname;
