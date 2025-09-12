// src/components/PartnershipSentlist.js
import React, { useEffect, useState } from "react";
import api from "../Api/api";

function PartnershipSentlist() {
  const [partnerships, setPartnerships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  // 파트너십 요청 목록 조회
  useEffect(() => {
    const fetchPartnerships = async () => {
      try {
        const response = await api.get("/partnerships/requests/sent");
        // accept 상태는 목록에서 제외
        const filtered = response.data.filter(item => item.status !== "ACCEPTED");
        setPartnerships(filtered);
      } catch (err) {
        console.error("요청 목록 조회 에러:", err.response || err);
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchPartnerships();

    // 실시간 상태 변경 체크 (옵션)
    const interval = setInterval(fetchPartnerships, 60000); // 1분마다 갱신
    return () => clearInterval(interval);
  }, []);

  // 요청 취소
  const handleCancelRequest = async (partnershipId) => {
    try {
      const response = await api.delete(`/partnerships/requests/${partnershipId}/cancel`);
      if (response.status === 200) {
        setMessage("파트너 요청이 성공적으로 취소되었습니다.");
        // 취소된 항목을 목록에서 제거
        setPartnerships((prev) =>
          prev.filter((item) => item.partnershipId !== partnershipId)
        );
      }
    } catch (err) {
      if (err.response) {
        switch (err.response.status) {
          case 404:
            setMessage("파트너가 존재하지 않습니다.");
            break;
          case 403:
            setMessage("취소할 권한이 없습니다.");
            break;
          case 402:
            setMessage("이미 수락되었습니다.");
            break;
          default:
            setMessage("요청 취소 중 오류가 발생했습니다.");
        }
      } else {
        setMessage("서버와 연결할 수 없습니다.");
      }
      console.error("요청 취소 에러:", err.response || err);
    }
  };

  if (loading) return <p>불러오는 중...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>보낸 파트너십 요청 목록</h2>
      {message && <p>{message}</p>}
      <ul>
        {partnerships.length > 0 ? (
          partnerships.map((item, index) => (
            <li key={index}>
              <p>파트너십 ID: {item.partnershipId}</p>
              <p>받는 사람 ID: {item.addresseeId}</p>
              <p>닉네임: {item.addresseeNickname}</p>
              <p>상태: {item.status}</p>
              <button onClick={() => handleCancelRequest(item.partnershipId)}>
                요청 취소
              </button>
            </li>
          ))
        ) : (
          <p>보낸 요청이 없습니다.</p>
        )}
      </ul>
    </div>
  );
}

export default PartnershipSentlist;
