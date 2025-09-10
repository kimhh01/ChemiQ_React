import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "../App.css";

function Login() {
  const navigate = useNavigate(); 
  const serverUrl = process.env.REACT_APP_API_URL;

  const [formData, setFormData] = useState({
    memberId: "",
    password: "",
  });

  const [error, setError] = useState(""); // 로그인 실패 메시지

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(""); 
  };

  // 로그인 요청
  const handleLogin = async () => {
    if (!formData.memberId || !formData.password) {
      setError("아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }

    try {
      const form = new FormData();
      form.append("memberId", formData.memberId);
      form.append("password", formData.password);

      const response = await fetch(serverUrl + "/login", {
        method: "POST",
        body: form,
      });

      const data = await response.json();

      if (response.ok) {
        // Access Token 저장
        const accessToken = response.headers.get("Authorization"); 
        if (accessToken) {
          localStorage.setItem("accessToken", accessToken.replace("Bearer ", ""));
        }

        // Refresh Token 저장
        if (data.refreshToken) {
          localStorage.setItem("refreshToken", data.refreshToken);
        }

        alert("로그인 성공!");
        navigate("/home"); // ✅ 로그인 성공 후 홈페이지로 이동
      } else {
        alert(`로그인 실패: ${data.message || "아이디 또는 비밀번호를 확인하세요."}`);
      }
    } catch (error) {
      console.error("로그인 오류:", error);
      alert("로그인 중 오류가 발생했습니다.");
    }
  };

  const handleSignup = () => {
    navigate("/SignUp"); 
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="title">ChemiQ</h1>
        <p className="subtitle">개발자는 당근을 흔들고 있어요!</p>

        <input
          type="text"
          name="memberId"
          placeholder="아이디"
          className="input-field"
          value={formData.memberId}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          className="input-field"
          value={formData.password}
          onChange={handleChange}
        />

        {error && <p className="error-text">{error}</p>}

        <button className="btn login-btn" onClick={handleLogin}>
          로그인
        </button>

        <button className="btn signup-btn" onClick={handleSignup}>
          회원가입
        </button>
      </div>
    </div>
  );
}

export default Login;
