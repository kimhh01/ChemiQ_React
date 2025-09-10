import React, { useState } from "react";
import "./SignUp.css"; 

function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    nickname: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  // 입력 필드 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 유효성 검사 로직
  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    // 아이디 유효성 검사
    if (formData.username.length < 5 || formData.username.length > 12) {
      newErrors.username = "아이디는 5자 이상 12자 이하여야 합니다.";
      isValid = false;
    }
    if (formData.username.includes(" ")) {
      newErrors.username = "아이디에 공백을 포함할 수 없습니다.";
      isValid = false;
    }
    if (/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(formData.username)) {
    newErrors.username = "아이디에 한글을 포함할 수 없습니다.";
    isValid = false;
    }

    // 닉네임 유효성 검사
    if (formData.nickname.length < 2 || formData.nickname.length > 6) {
      newErrors.nickname = "닉네임은 2자 이상 6자 이하여야 합니다.";
      isValid = false;
    }
    if (formData.nickname.includes(" ")) {
      newErrors.nickname = "닉네임에 공백을 포함할 수 없습니다.";
      isValid = false;
    }

    // 비밀번호 유효성 검사
    if (formData.password.length < 8 || formData.password.length > 16) {
      newErrors.password = "비밀번호는 8자 이상 16자 이하여야 합니다.";
      isValid = false;
    }
    if (/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(formData.password)) {
      newErrors.password = "비밀번호에 한글을 포함할 수 없습니다.";
      isValid = false;
    }
    if (formData.password.includes(" ")) {
      newErrors.password = "비밀번호에 공백을 포함할 수 없습니다.";
      isValid = false;
    }

    // 비밀번호 확인
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    // alert()는 현재 환경에서 지원되지 않아 console.log로 대체합니다.
    const showMessage = (message) => {
      console.log(message);
    };

    try {
      const response = await fetch(process.env.REACT_APP_API_URL + '/signup', {
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

      if (response.ok) {
        showMessage("회원가입 성공!");
        setFormData({
          username: "",
          nickname: "",
          password: "",
          confirmPassword: "",
        });
      } else if (response.status === 401) {
        showMessage("인증 실패: 아이디 또는 비밀번호 확인 필요");
      } else {
        const data = await response.json().catch(() => null);
        showMessage(data?.message || "회원가입 실패");
      }
    } catch (error) {
      console.error("회원가입 에러:", error);
      showMessage("서버와 연결할 수 없습니다.");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>회원가입</h2>
        <form onSubmit={handleSubmit}>
          {/* 아이디 입력 필드 */}
          <label>아이디</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="아이디 입력"
            required
          />
          {errors.username && <p className="error-text">{errors.username}</p>}

          {/* 닉네임 입력 필드 */}
          <label>닉네임</label>
          <input
            type="text"
            name="nickname"
            value={formData.nickname}
            onChange={handleChange}
            placeholder="닉네임 입력"
            required
          />
          {errors.nickname && <p className="error-text">{errors.nickname}</p>}

          {/* 비밀번호 입력 필드 */}
          <label>비밀번호</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="비밀번호 입력"
            required
          />
          {errors.password && <p className="error-text">{errors.password}</p>}

          {/* 비밀번호 확인 입력 필드 */}
          <label>비밀번호 확인</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="비밀번호 확인"
            required
          />
          {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}

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
