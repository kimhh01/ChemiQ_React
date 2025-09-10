import React from "react";
import { useNavigate } from "react-router-dom";
import PartnerInfo from "../PartnerShip/PartnerInfo";

function MyPage() {

    const navigate = useNavigate();

     const goToPasswordChange = () => {
    navigate("/password-change"); // 비밀번호 변경 페이지로 이동
     }
     
    return (
        <div className="my-page">
        <h3>마이페이지</h3>
        <PartnerInfo />
        <button onClick={goToPasswordChange}> 비밀번호 변경 </button>
        </div>
    )
}
export default MyPage;