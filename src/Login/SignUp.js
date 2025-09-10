import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignUp.css";

function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    nickname: "",
    password: "",
    confirmPassword: "",
  });
  const serverUrl = process.env.REACT_APP_API_URL+'/signup'

  const [passwordMatch, setPasswordMatch] = useState(true); // 비밀번호 일치 여부

  const navigate = useNavigate(); // useNavigate 훅 사용

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "confirmPassword" || name === "password") {
      setPasswordMatch(
        name === "password"
          ? value === formData.confirmPassword
          : formData.password === value
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passwordMatch) return;

    try {
      const response = await fetch(serverUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          memberId: formData.username,
          nickname: formData.nickname,
          password: formData.password,
        }),
      });

      // 응답 상태 확인
      if (response.ok) {
        alert("회원가입 성공!");
        setFormData({
          username: "",
          nickname: "",
          password: "",
          confirmPassword: "",
        });
      } else if (response.status === 401) {
        alert("인증 실패: 아이디 또는 비밀번호 확인 필요");
      } else {
        // 상태 코드에 상관없이 JSON이 있으면 파싱
        const data = await response.json().catch(() => null);
        alert(data?.message || "회원가입 실패");
      }
    } catch (error) {
      console.error("회원가입 에러:", error);
      alert("서버와 연결할 수 없습니다.");
    }
    navigate("/"); // 로그인 페이지 경로
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>회원가입</h2>
        <form onSubmit={handleSubmit}>
          <label>아이디</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="아이디 입력"
            required
          />

          <label>닉네임</label>
          <input
            type="text"
            name="nickname"
            value={formData.nickname}
            onChange={handleChange}
            placeholder="닉네임 입력"
            required
          />

          <label>비밀번호</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="비밀번호 입력"
            required
          />

          <label>비밀번호 확인</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="비밀번호 확인"
            required
          />
          {!passwordMatch && (
            <p className="error-text">비밀번호가 일치하지 않습니다.</p>
          )}

          <button type="submit" className="signup-btn">
            회원가입
          </button>
        </form>
        <p className="signup-footer">
          이미 계정이 있나요? <a href="/">로그인</a>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
