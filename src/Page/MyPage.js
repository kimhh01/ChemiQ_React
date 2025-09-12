import React from "react";
import { useNavigate } from "react-router-dom";
import MyInfo from "../PartnerShip/MyInfo";

function MyPage() {

    const navigate = useNavigate();

     const goToPasswordChange = () => {
    navigate("/password-change"); // 비밀번호 변경 페이지로 이동
     }

     const goToNicknameChange = () => {
        navigate("/nickname-change");
     }
     
    return (
        <div className="my-page">
        <h3>마이페이지</h3>
        <MyInfo/>
        <button onClick={goToPasswordChange}> 비밀번호 변경 </button>
        <button onClick={goToNicknameChange}> 닉네임 변경</button>
        </div>
    )
}
export default MyPage;