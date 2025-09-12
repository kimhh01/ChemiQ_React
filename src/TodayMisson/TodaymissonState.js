// TodayMission.js
import React, { useEffect, useState } from "react";
import api from "../Api/api"; // api.js 불러오기

function TodaymissionState() {
  const [mission, setMission] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMission = async () => {
      try {
        const res = await api.get("/timeline/today"); // 오늘의 미션 조회 API
        if (res.status === 200) {
          setMission(res.data);
          setError("");
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError("오늘의 미션이 없습니다.");
        } else {
          setError("서버와의 통신 중 문제가 발생했습니다.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMission();
  }, []);

  if (loading) return <p>오늘의 미션을 불러오는 중...</p>;

  return (
    <div style={{ margin: "20px" }}>
      <h2>오늘의 미션 현황</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {mission && (
        <div style={{ marginTop: "15px" }}>
          <h3>미션 정보</h3>
          <p>제목: {mission.missionTitle}</p>
          <p>날짜: {mission.missionDate}</p>

          {/* 내 제출 */}
          <h3>나의 제출</h3>
          {mission.mySubmission ? (
            <>
              <p>ID: {mission.mySubmission.submissionId}</p>
              <p>내용: {mission.mySubmission.content}</p>
              <p>점수: {mission.mySubmission.score}</p>
              <p>제출일: {mission.mySubmission.createdAt}</p>
              <img
                src={mission.mySubmission.imageUrl}
                alt="내 제출 이미지"
                style={{ width: "100px", borderRadius: "10px" }}
              />
            </>
          ) : (
            <p style={{ color: "red" }}>아직 제출하지 않았습니다.</p>
          )}

          {/* 파트너 제출 */}
          <h3>파트너 제출</h3>
          {mission.partnerSubmission ? (
            <>
              <p>ID: {mission.partnerSubmission.submissionId}</p>
              <p>내용: {mission.partnerSubmission.content}</p>
              <p>점수: {mission.partnerSubmission.score}</p>
              <p>제출일: {mission.partnerSubmission.createdAt}</p>
              <img
                src={mission.partnerSubmission.imageUrl}
                alt="파트너 제출 이미지"
                style={{ width: "100px", borderRadius: "10px" }}
              />
            </>
          ) : (
            <p style={{ color: "red" }}>파트너가 아직 제출하지 않았습니다.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default TodaymissionState;
