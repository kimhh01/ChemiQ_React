// src/components/TodayMission.js
import React, { useEffect, useState } from "react";
import api from "../Api/api"; 
import MissionSubmit from "../MissionSubmit"; // 미션 제출 모달 컴포넌트

function TodayMission() {
  const [mission, setMission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 모달 상태
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [dailyMissionId, setDailyMissionId] = useState(null);

  useEffect(() => {
    const fetchTodayMission = async () => {
      try {
        // 서버의 오늘 미션 API 호출
        const response = await api.get("/missions/today");
        setMission(response.data);

        // ✅ dailyMissionId는 따로 저장
        if (response.data?.dailyMissionId) {
          setDailyMissionId(response.data.dailyMissionId);
        }
      } catch (err) {
        console.error("오늘의 미션 조회 에러:", err.response || err);
        if (err.response?.status === 404) {
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
          <p><strong>제목:</strong> {mission.title}</p>
          <p><strong>설명:</strong> {mission.description}</p>

          {/* dailyMissionId는 보이지 않음 */}
          <button
            type="button"
            onClick={() => setShowSubmitModal(true)}
          >
            제출하기
          </button>
        </div>
      ) : (
        <p>오늘의 미션이 없습니다.</p>
      )}

      {/* 제출 모달 */}
      {showSubmitModal && dailyMissionId && (
        <MissionSubmit
          dailyMissionId={dailyMissionId}
          onClose={() => setShowSubmitModal(false)}
        />
      )}
    </div>
  );
}

export default TodayMission;
