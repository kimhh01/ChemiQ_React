// EvaluateModal.js
import React, { useState } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import api from "./Api/api";

function EvaluateModal({ submissionId, onClose }) {
  const [score, setScore] = useState(0);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");

  const handleStarClick = (value) => {
    setScore(value);
  };

  const handleSubmit = async () => {
    if (!score) {
      alert("별점을 선택해주세요.");
      return;
    }

    if (!window.confirm("평가를 제출하면 수정할 수 없습니다. 진행하시겠습니까?")) {
      return;
    }

    try {
      const res = await api.post(`/submissions/${submissionId}/evaluations`, {
        score,
        comment,
      });

      // ✅ 성공 처리 (200~299)
      if (res.status >= 200 && res.status < 300) {
        alert("평가가 성공적으로 제출되었습니다."); // 성공 메시지
        setMessage("평가가 성공적으로 제출되었습니다.");
        onClose(); // 모달 닫기
      }
    } catch (err) {
      if (err.response) {
        switch (err.response.status) {
          case 400:
            setMessage("잘못된 요청 데이터입니다. (점수 범위 초과)");
            break;
          case 403:
            setMessage("자신의 제출물은 평가할 수 없습니다.");
            break;
          case 404:
            setMessage("존재하지 않는 제출물입니다.");
            break;
          case 409:
            setMessage("이미 평가가 완료된 제출물입니다.");
            break;
          default:
            setMessage("평가 제출 중 오류가 발생했습니다.");
        }
      } else {
        setMessage("서버와의 연결에 실패했습니다.");
      }
      console.error("평가 오류:", err.response || err);
    }
  };

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
        <h2>미션 평가</h2>
        <p>제출 ID: {submissionId}</p>

        {/* ⭐ 별점 */}
        <div
          style={{
            fontSize: "40px",
            margin: "10px 0",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <div key={star} style={{ position: "relative", width: "40px", height: "40px" }}>
              {/* 왼쪽 반쪽 */}
              <div
                onClick={() => handleStarClick(star - 0.5)}
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: "50%",
                  height: "100%",
                  cursor: "pointer",
                  zIndex: 2,
                }}
              />
              {/* 오른쪽 반쪽 */}
              <div
                onClick={() => handleStarClick(star)}
                style={{
                  position: "absolute",
                  right: 0,
                  top: 0,
                  width: "50%",
                  height: "100%",
                  cursor: "pointer",
                  zIndex: 2,
                }}
              />
              {/* 별 아이콘 */}
              {score >= star ? (
                <AiFillStar color="#FFD700" size={40} />
              ) : score >= star - 0.5 ? (
                <AiFillStar color="#FFD700" size={40} style={{ clipPath: "inset(0 50% 0 0)" }} />
              ) : (
                <AiOutlineStar color="#FFD700" size={40} />
              )}
            </div>
          ))}
        </div>
        <p>선택한 점수: {score}</p>

        {/* 💬 코멘트 */}
        <textarea
          placeholder="코멘트를 입력하세요"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          style={{ width: "100%", height: "80px", marginTop: "10px" }}
        />

        {/* 버튼 */}
        <div style={{ marginTop: "15px" }}>
          <button onClick={handleSubmit} style={{ marginRight: "10px" }}>
            평가 제출
          </button>
          <button onClick={onClose}>닫기</button>
        </div>

        {message && (
          <p style={{ marginTop: "10px", color: message.includes("성공") ? "green" : "red" }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default EvaluateModal;
