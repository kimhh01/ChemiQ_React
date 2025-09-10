// src/components/PartnershipReceivedList.js
import React, { useEffect, useState } from "react";
import api from "../Api/api"; 

function PartnershipReceivedList() {
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 받은 요청 목록 불러오기
  useEffect(() => {
    const fetchReceivedRequests = async () => {
      try {
        const response = await api.get("/partnerships/requests/received");
        setReceivedRequests(response.data); // 배열 형태
      } catch (err) {
        console.error(err);
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchReceivedRequests();
  }, []);

  // 요청 거절 함수
  const handleReject = async (partnershipId) => {
    try {
      await api.delete(`/partnerships/requests/${partnershipId}/reject`); 
      // 거절 성공 시 목록에서 해당 요청 제거
      setReceivedRequests((prev) =>
        prev.filter((item) => item.partnershipId !== partnershipId)
      );
      alert("요청을 거절했습니다.");
    } catch (err) {
      console.error(err);
      alert("거절 중 오류가 발생했습니다.");
    }
  };

  //요청 수락 함수 
    const handleaccepted = async (partnershipId) => {
    try {
      await api.post(`/partnerships/requests/${partnershipId}/accept`); 
      // 수락 성공 시 목록에서 해당 요청 제거
      setReceivedRequests((prev) =>
        prev.filter((item) => item.partnershipId !== partnershipId)
      );
      alert("요청을 수락하였습니다.");
    } catch (err) {
      console.error(err);
      alert("수락 중 오류가 발생했습니다.");
    }
  };

  if (loading) return <p>불러오는 중...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>받은 파트너십 요청 목록</h2>
      {receivedRequests.length === 0 ? (
        <p>받은 요청이 없습니다.</p>
      ) : (
        <ul>
          {receivedRequests.map((item) => (
            <li key={item.partnershipId}>
              <p>파트너십 ID: {item.partnershipId}</p>
              <p>요청자 ID: {item.requesterId}</p>
              <p>닉네임: {item.requesterNickname}</p>
              <button onClick={() => handleaccepted(item.partnershipId)}>
                수락
              </button>
              <button onClick={() => handleReject(item.partnershipId)}>
                거절
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PartnershipReceivedList;
