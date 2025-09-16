import React from "react";
import { useNavigate } from "react-router-dom"; // ✅ 추가
import PartnerRequests from "../PartnerShip/PartnerRequests";
import PartnershipSentlist from "../PartnerShip/PartnershipSentlist";
import PartnershipReceivedlist from "../PartnerShip/PartnershipRecivedlist";
import "./PartnerPage.css";

function PartnerPage() {
  const navigate = useNavigate(); // ✅ 네비게이트 훅

  return (
    <div className="partner-page">
      <h2>파트너 요청 관리</h2>

      {/* 네비게이션 버튼 영역 */}
      <div className="partner-nav">
        <button onClick={() => navigate(-1)} className="partner-nav-button">
          ← 뒤로 가기
        </button>
        <button onClick={() => navigate("/home")} className="partner-nav-button">
          🏠 홈으로
        </button>
      </div>

      <div className="partner-section">
        <h3>파트너 요청 보내기</h3>
        <PartnerRequests />
      </div>

      <div className="partner-section">
        <h3>내가 보낸 요청</h3>
        <PartnershipSentlist />
      </div>

      <div className="partner-section">
        <h3>내가 받은 요청</h3>
        <PartnershipReceivedlist />
      </div>
    </div>
  );
}

export default PartnerPage;
