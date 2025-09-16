import React, { useEffect, useState } from "react";
import api from "../Api/api";
import EvaluateModal from "../Evaluate/EvaluateModal";
import EvaluateViewModal from "../Evaluate/EvaluateViewModal";
import "./TodaymissionState.css"; // ✅ CSS import

function TodaymissionState() {
  const [mission, setMission] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState(null);
  const [viewSubmissionId, setViewSubmissionId] = useState(null);

  useEffect(() => {
    const fetchMission = async () => {
      try {
        const res = await api.get("/timeline/today");
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}월 ${String(date.getDate()).padStart(2, "0")}일 ${String(
      date.getHours()
    ).padStart(2, "0")}시 ${String(date.getMinutes()).padStart(2, "0")}분`;
  };

  if (loading) return <p>오늘의 미션을 불러오는 중...</p>;

  return (
    <div className="todaymission-card">
      <h2>오늘의 미션 현황</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {mission && (
        <div>
          <h3>미션 정보</h3>
          <p>제목: {mission.missionTitle}</p>
          <p>날짜: {mission.missionDate}</p>

          {/* 내 제출 */}
          <div className="submission-card">
            <h3>나의 제출</h3>
            {mission.mySubmission ? (
              <>
                <p>ID: {mission.mySubmission.submissionId}</p>
                <p>내용: {mission.mySubmission.content}</p>
                <p>점수: {mission.mySubmission.score}</p>
                <p>제출일: {formatDate(mission.mySubmission.createdAt)}</p>
                <img
                  src={mission.mySubmission.imageUrl}
                  alt="내 제출 이미지"
                  className="submission-image"
                />
                {mission.mySubmission.score && (
                  <button
                    className="action-button"
                    onClick={() =>
                      setViewSubmissionId(mission.mySubmission.submissionId)
                    }
                  >
                    내 제출 평가 조회
                  </button>
                )}
              </>
            ) : (
              <p style={{ color: "red" }}>아직 제출하지 않았습니다.</p>
            )}
          </div>

          {/* 파트너 제출 */}
          <div className="submission-card">
            <h3>파트너 제출</h3>
            {mission.partnerSubmission ? (
              <>
                <p>ID: {mission.partnerSubmission.submissionId}</p>
                <p>내용: {mission.partnerSubmission.content}</p>
                <p>점수: {mission.partnerSubmission.score}</p>
                <p>제출일: {formatDate(mission.partnerSubmission.createdAt)}</p>
                <img
                  src={mission.partnerSubmission.imageUrl}
                  alt="파트너 제출 이미지"
                  className="submission-image"
                />
                <button
                  className="action-button"
                  onClick={() =>
                    setSelectedSubmissionId(
                      mission.partnerSubmission.submissionId
                    )
                  }
                >
                  평가하기
                </button>
                {mission.partnerSubmission.score && (
                  <button
                    className="action-button"
                    onClick={() =>
                      setViewSubmissionId(
                        mission.partnerSubmission.submissionId
                      )
                    }
                  >
                    파트너 제출 평가 조회
                  </button>
                )}
              </>
            ) : (
              <p style={{ color: "red" }}>파트너가 아직 제출하지 않았습니다.</p>
            )}
          </div>
        </div>
      )}

      {/* 평가 모달 */}
      {selectedSubmissionId && (
        <EvaluateModal
          submissionId={selectedSubmissionId}
          onClose={() => setSelectedSubmissionId(null)}
        />
      )}

      {/* 평가 조회 모달 */}
      {viewSubmissionId && (
        <EvaluateViewModal
          submissionId={viewSubmissionId}
          onClose={() => setViewSubmissionId(null)}
        />
      )}
    </div>
  );
}

export default TodaymissionState;
