import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // 경로 정보 가져오기
import api from "../Api/api";

function PartnerInfo() {
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const location = useLocation(); // 현재 경로 가져오기

  useEffect(() => {
    const fetchPartnerInfo = async () => {
      try {
        const response = await api.get("/partnerships");
        setPartner(response.data);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError("파트너 관계가 존재하지 않습니다.");
        } else {
          setError("데이터를 불러오는 중 오류가 발생했습니다.");
        }
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

  // 홈 화면인지 확인 (예: 경로가 '/'이면 홈)
  const isHome = location.pathname === "/home";

  return (
    <div>
      <h2>파트너 정보</h2>
      {partner ? (
        <>
          <p>파트너 ID: {partner.partnerId}</p>
          <p>파트너 닉네임: {partner.partnerNickname}</p>
          {/* 홈 화면이 아니면 버튼 보여주기 */}
          {!isHome && (
            <button onClick={handleUnlinkPartner}>파트너 해제</button>
          )}
        </>
      ) : (
        <p>현재 파트너가 없습니다.</p>
      )}
      {message && <p>{message}</p>}
    </div>
  );
}

export default PartnerInfo;
