import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MyInfo from "../PartnerShip/MyInfo";
import ProfileImageUpload from "../ProfileImageUpload";

function MyPage() {

    const navigate = useNavigate();

    const [showUpload, setShowUpload] = useState(false); // 🔹 모달 열림 상태 제어

     const goToPasswordChange = () => {
    navigate("/password-change"); // 비밀번호 변경 페이지로 이동
     }

     const goToNicknameChange = () => {
        navigate("/nickname-change");
     }
     
    return (
        <div className="my-page">
  <div className="my-page-box">
    <h3>마이페이지</h3>
    <MyInfo className="my-info" />
    <button onClick={() => setShowUpload(true)}>프로필 사진 수정</button>
    <button onClick={goToPasswordChange}>비밀번호 변경</button>
    <button onClick={goToNicknameChange}>닉네임 변경</button>
  </div>

  {showUpload && (
    <div className="profile-upload-modal">
      <div className="profile-upload-content">
        <ProfileImageUpload onClose={() => setShowUpload(false)} />
      </div>
    </div>
  )}
</div>

    )
}
export default MyPage;