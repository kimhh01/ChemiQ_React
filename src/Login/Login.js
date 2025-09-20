// src/Login/Login.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const serverUrl = process.env.REACT_APP_API_URL;

  const [formData, setFormData] = useState({
    memberId: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ 세션 만료 메시지 확인
  useEffect(() => {
    const sessionMsg = localStorage.getItem("sessionExpiredMsg");
    if (sessionMsg) {
      setError(sessionMsg);
      localStorage.removeItem("sessionExpiredMsg");
    }
  }, []);

  // 입력값 변경
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
      setLoading(true);

      const form = new FormData();
      form.append("memberId", formData.memberId);
      form.append("password", formData.password);

      const response = await fetch(serverUrl + "/login", {
        method: "POST",
        body: form,
      });

      const data = await response.json();

      if (response.ok) {
        const accessToken = response.headers.get("Authorization");
        if (accessToken) {
          localStorage.setItem(
            "accessToken",
            accessToken.replace("Bearer ", "")
          );
        }
        if (data.refreshToken) {
          localStorage.setItem("refreshToken", data.refreshToken);
        }
        navigate("/home");
      } else {
        setError(data.message || "아이디 또는 비밀번호를 확인하세요.");
      }
    } catch (error) {
      console.error("로그인 오류:", error);
      setError("로그인 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = () => {
    navigate("/signup");
  };

  return (
    <div className="login-page">
      {/* 왼쪽 이미지 카드 */}
      <div className="login-image-wrapper">
        <div
          className="login-image-card"
          style={{ backgroundImage: 'url("/login-illustration.png")' }}
        ></div>
      </div>

      {/* 오른쪽 로그인 박스 */}
      <div className="login-box">
        <div className="login-header">
          <h2>로그인</h2>
          <p>ChemiQ에 다시 오신 걸 환영합니다 🎉</p>
        </div>

        {error && <div className="error-message">{error}</div>}

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

        <button className="login-btn" onClick={handleLogin} disabled={loading}>
          {loading ? "로그인 중..." : "로그인"}
        </button>

        <div className="signup-section">
          <p>아직 계정이 없으신가요?</p>
          <button onClick={handleSignup} className="signup-link">
            회원가입 하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
