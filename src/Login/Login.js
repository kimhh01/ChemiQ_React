import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "./Login.css";

function Login() {
  const navigate = useNavigate(); 
  const serverUrl = process.env.REACT_APP_API_URL;

  const [formData, setFormData] = useState({
    memberId: "",
    password: "",
  });

  const [error, setError] = useState(""); // 로그인 실패 메시지
  const [loading] = useState(false);

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
    <div className="login-page">
      <div className="login-box">
        {/* 헤더 */}
        <div className="login-header">
          <h2>로그인</h2>
          <p>ChemiQ에 다시 오신 걸 환영합니다 🎉</p>
        </div>

        {/* 에러 메시지 */}
        {error && <div className="error-message">{error}</div>}

        {/* 입력폼 */}
        <div className="input-group">
          <label htmlFor="memberId">아이디</label>
          <input
            type="text"
            id="memberId"
            name="memberId"
            className="login-input"
            placeholder="아이디를 입력하세요"
            value={formData.memberId}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            name="password"
            className="login-input"
            placeholder="비밀번호를 입력하세요"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        {/* 로그인 버튼 */}
        <button
          className="login-btn"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "로그인 중..." : "로그인"}
        </button>

        {/* 회원가입 안내 */}
        <div className="signup-section">
          <p>아직 계정이 없으신가요?</p>
          <a href="/signup">회원가입 하기</a>
        </div>
      </div>
    </div>
  );
}

export default Login;