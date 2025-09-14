// EvaluateViewModal.js
import React, { useEffect, useState } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import api from "../Api/api";

function EvaluateViewModal({ submissionId, onClose }) {
  const [evaluation, setEvaluation] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvaluation = async () => {
      try {
        const res = await api.get(`/submissions/${submissionId}/evaluation`);
        if (res.status === 200) {
          setEvaluation(res.data);
          setError("");
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError("해당 제출물의 평가를 찾을 수 없습니다.");
        } else {
          setError("평가 조회 중 오류가 발생했습니다.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluation();
  }, [submissionId]);

  // ⭐ 별점 렌더링
  const renderStars = (score) => (
    <div style={{ fontSize: "30px", display: "flex", justifyContent: "center" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} style={{ position: "relative", width: "30px", height: "30px" }}>
          {score >= star ? (
            <AiFillStar color="#FFD700" size={30} />
          ) : score >= star - 0.5 ? (
            <AiFillStar
              color="#FFD700"
              size={30}
              style={{ clipPath: "inset(0 50% 0 0)" }}
            />
          ) : (
            <AiOutlineStar color="#FFD700" size={30} />
          )}
        </span>
      ))}
    </div>
  );

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "10px",
          padding: "20px",
          width: "400px",
          textAlign: "center",
        }}
      >
        <h2>평가 조회</h2>

        {loading && <p>평가 정보를 불러오는 중...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {evaluation ? (
          <div style={{ marginTop: "15px" }}>
            {renderStars(evaluation.score)}
            <p>
              <strong>코멘트:</strong> {evaluation.comment}
            </p>
            <p>
              <strong>평가자:</strong> {evaluation.evaluatorNickname}
            </p>
            <p>
              <strong>평가일:</strong>{" "}
              {new Date(evaluation.createdAt).toLocaleString()}
            </p>
          </div>
        ) : (
          !loading && <p style={{ color: "gray" }}>아직 평가되지 않았습니다.</p>
        )}

        <div style={{ marginTop: "15px" }}>
          <button onClick={onClose}>닫기</button>
        </div>
      </div>
    </div>
  );
}

export default EvaluateViewModal;
