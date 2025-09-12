// PasswordChange.js
import React, { useState } from "react";
import api from "../Api/api"; // api.js에서 만든 axios 인스턴스

function ChangePassword() {
  const [formData, setFormData] = useState({
    password: "",
    newPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    let isValid = true;

    // 새 비밀번호 유효성 검사
    if (formData.newPassword.length < 8 || formData.newPassword.length > 16) {
      newErrors.newPassword = "비밀번호는 8자 이상 16자 이하여야 합니다.";
      isValid = false;
    }
    if (/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(formData.newPassword)) {
      newErrors.newPassword = "비밀번호에 한글을 포함할 수 없습니다.";
      isValid = false;
    }
    if (formData.newPassword.includes(" ")) {
      newErrors.newPassword = "비밀번호에 공백을 포함할 수 없습니다.";
      isValid = false;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword)) {
      newErrors.newPasswordpassword = "비밀번호에는 최소 1개의 특수문자가 포함되어야 합니다.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    console.log(formData.password);
    console.log(formData.newPassword);

    try {
      // 비밀번호 변경 API 호출
      const response = await api.patch("/members/me/password", {
        password: formData.password,       // 기존 비밀번호
        newPassword: formData.newPassword, // 새 비밀번호
      });

      setSuccessMessage("비밀번호가 성공적으로 변경되었습니다.");
      setFormData({ password: "", newPassword: "" });
      setErrors({});
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data && error.response.data.message) {
        setErrors({ api: error.response.data.message });
      } else {
        setErrors({ api: "비밀번호 변경 중 오류가 발생했습니다." });
      }
    }
  };

  return (
    <div>
      <h2>비밀번호 변경</h2>
      {errors.api && <p style={{ color: "red" }}>{errors.api}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>기존 비밀번호:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
        </div>
        <div>
          <label>새 비밀번호:</label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
          />
          {errors.newPassword && <p style={{ color: "red" }}>{errors.newPassword}</p>}
        </div>
        <button type="submit">변경</button>
      </form>
    </div>
  );
}

export default ChangePassword;
