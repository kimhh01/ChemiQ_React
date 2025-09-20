import React, { useEffect, useState } from "react";
import api from "../Api/api";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import "./MissionHistory.css";

// 날짜 변환 함수
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}년 ${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}월 ${String(date.getDate()).padStart(2, "0")}일 ${String(
    date.getHours()
  ).padStart(2, "0")}시 ${String(date.getMinutes()).padStart(2, "0")}분`;
};

// ✅ 캐시 만료 시간 
const CACHE_TTL = 1000 * 60 * 1;

function MissionHistory() {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const size = 3;

  useEffect(() => {
    const fetchMissions = async () => {
      const cacheKey = `missions_page_${page}`;
      const cachedData = localStorage.getItem(cacheKey);
      const now = Date.now();

      // ✅ 캐시 확인
      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
        if (now - timestamp < CACHE_TTL) {
          setMissions(data.content);
          setTotalPages(data.totalPages);
          setLoading(false);
          return; // 캐시 사용 → 네트워크 요청 X
        }
      }

      // ✅ API 호출
      try {
        setLoading(true);
        const res = await api.get("/timeline", { params: { page, size } });
        if (res.status === 200) {
          setMissions(res.data.content);
          setTotalPages(res.data.totalPages);

          // ✅ localStorage에 캐시 저장
          localStorage.setItem(
            cacheKey,
            JSON.stringify({
              data: res.data,
              timestamp: now,
            })
          );

          setError("");
        }
      } catch (err) {
        setError("미션 기록을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchMissions();
  }, [page]);

  if (loading) return <p>미션 기록을 불러오는 중...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="mission-history-container">
      <h2>최근 미션 기록</h2>

      {missions.length > 0 ? (
        missions.map((mission) => (
          <div key={mission.dailyMissionId} className="mission-card">
            <h3>{mission.missionTitle}</h3>
            <p className="mission-date">날짜: {mission.missionDate}</p>

            {/* 내 제출 */}
            <div className="submission-card my-submission">
              <h4>나의 제출</h4>
              {mission.mySubmission ? (
                <>
                  <p>내용: {mission.mySubmission.content}</p>
                  <p>점수: {mission.mySubmission.score}</p>
                  <p>제출일: {formatDate(mission.mySubmission.createdAt)}</p>
                  <LazyLoadImage
                    src={mission.mySubmission.imageUrl}
                    alt="내 제출 이미지"
                    className="submission-image"
                    effect="blur"
                  />
                </>
              ) : (
                <p className="no-submission">아직 제출하지 않았습니다.</p>
              )}
            </div>

            {/* 파트너 제출 */}
            <div className="submission-card partner-submission">
              <h4>파트너 제출</h4>
              {mission.partnerSubmission ? (
                <>
                  <p>내용: {mission.partnerSubmission.content}</p>
                  <p>점수: {mission.partnerSubmission.score}</p>
                  <p>제출일: {formatDate(mission.partnerSubmission.createdAt)}</p>
                  <LazyLoadImage
                    src={mission.partnerSubmission.imageUrl}
                    alt="파트너 제출 이미지"
                    className="submission-image"
                    effect="blur"
                  />
                </>
              ) : (
                <p className="no-submission">
                  파트너가 아직 제출하지 않았습니다.
                </p>
              )}
            </div>
          </div>
        ))
      ) : (
        <p>기록이 없습니다.</p>
      )}

      {/* 페이지네이션 */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => setPage(index)}
            className={`page-button ${page === index ? "active" : ""}`}
            disabled={page === index}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default MissionHistory;
