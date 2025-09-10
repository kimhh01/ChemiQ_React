// src/components/TodayMission.js
import React, { useEffect, useState } from "react";
import api from "./Api/api"; // api.js에서 엑세스 토큰이 포함된 axios 인스턴스

function TodayMission() {
  const [mission, setMission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTodayMission = async () => {
      try {
        // 서버의 오늘 미션 API 호출
        const response = await api.get("/missions/today");
        // response.data가 { missionId, title, description } 형태라고 가정
        setMission(response.data);
      } catch (err) {
        console.error("오늘의 미션 조회 에러:", err.response || err);
        if (err.response.status===404) {
          setError(`오류 발생: ${err.response.status} ${err.response.statusText}`);
          setError("오늘의 미션이 없습니다.");
        } else {
          setError("서버와 연결할 수 없습니다.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTodayMission();
  }, []);

  if (loading) return <p>오늘의 미션을 불러오는 중...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>오늘의 미션</h2>
      {mission ? (
        <div>
          <p><strong>ID:</strong> {mission.missionId}</p>
          <p><strong>제목:</strong> {mission.title}</p>
          <p><strong>설명:</strong> {mission.description}</p>
        </div>
      ) : (
        <p>오늘의 미션이 없습니다.</p>
      )}
    </div>
  );
}

export default TodayMission;
