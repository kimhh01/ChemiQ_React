import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../Api/api";
import "./PartnerInfo.css"; // 스타일 적용

function PartnerInfo() {
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const location = useLocation();

  useEffect(() => {
    const fetchPartnerInfo = async () => {
      try {
        // ✅ 내 정보 API에서 partnerInfo만 가져오기
        const response = await api.get("/members/me/info");
        if (response.status === 200 && response.data.partnerInfo) {
          setPartner(response.data.partnerInfo);
        } else {
          setError("파트너 관계가 존재하지 않습니다.");
        }
      } catch (err) {
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
        console.error("파트너 정보 조회 에러:", err.response || err);
      } finally {
        setLoading(false);
      }
    };

    fetchPartnerInfo();
  }, []);

  const handleUnlinkPartner = async () => {
    try {
      const response = await api.delete("/partnerships");
      if (response.status === 200) {
        setMessage("파트너 해제가 성공적으로 완료되었습니다.");
        setPartner(null);
      }
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setMessage("해제할 파트너가 존재하지 않습니다.");
      } else {
        setMessage("파트너 해제 중 오류가 발생했습니다.");
      }
      console.error("파트너 해제 에러:", err.response || err);
    }
  };

  if (loading) return <p>불러오는 중...</p>;
  if (error) return <p>{error}</p>;

  const isHome = location.pathname === "/home";

  return (
  <div className="partner-container">
    <div className="partner-card">
      <h2>파트너 정보</h2>

      {partner ? (
        <>
          <img
            src={partner.profileImageUrl || "https://via.placeholder.com/100"}
            alt="파트너 프로필"
            className="partner-profile"
          />

          {/* ✅ 내부 작은 카드뷰 */}
          <div className="partner-subcard">
            <div className="partner-info">
              <p>파트너 ID: {partner.memberId}</p>
              <p>파트너 닉네임: {partner.nickname}</p>
              <p>가입일: {partner.created}</p>
            </div>

            {!isHome && (
              <button className="partner-button" onClick={handleUnlinkPartner}>
                파트너 해제
              </button>
            )}
          </div>
        </>
      ) : (
        <p>현재 파트너가 없습니다.</p>
      )}

      {message && <p className="partner-message">{message}</p>}
    </div>
  </div>
);
}

export default PartnerInfo;
