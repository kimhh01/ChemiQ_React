// src/Mission/MissionSubmit.js
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import api from "../Api/api";
import "./MissionSubmit.css";

function MissionSubmit({ dailyMissionId, onClose }) {
  const [file, setFile] = useState(null);
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // 모달 열릴 때 배경 스크롤 방지
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev || "auto";
    };
  }, []);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async () => {
    if (!file) return setMessage("❌ 업로드할 이미지를 선택해주세요.");
    if (!content.trim()) return setMessage("❌ 내용을 입력해주세요.");

    try {
      setLoading(true);
      const presignRes = await api.post("/submissions/presigned-url", { filename: file.name });
      if (presignRes.status === 200) {
        const { presignedUrl, fileKey } = presignRes.data;

        await fetch(presignedUrl, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type },
        });

        const completeRes = await api.post("/submissions", {
          dailyMissionId,
          content,
          fileKey,
        });

        if (completeRes.status === 200) {
          setMessage("✅ 미션이 성공적으로 제출되었습니다!");
          setSuccess(true);
        }
      }
    } catch (e) {
      setMessage("❌ 제출 실패: 서버 오류 또는 네트워크 문제");
    } finally {
      setLoading(false);
    }
  };

  const modal = (
    <div className="modal-overlay" onClick={onClose}>
      {/* 고정 중앙 배치: 부모 영향 0 */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>미션 제출</h3>

        {success ? (
          <>
            <p className="msg success">{message}</p>
            <button className="btn" onClick={onClose}>확인</button>
          </>
        ) : (
          <>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <textarea
              placeholder="내용을 입력하세요"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <div className="button-group">
              <button className="btn" onClick={handleSubmit} disabled={loading}>
                {loading ? "제출 중..." : "제출하기"}
              </button>
              <button className="btn ghost" onClick={onClose}>닫기</button>
            </div>
            {message && <p className={`msg ${message.includes("✅") ? "success" : "error"}`}>{message}</p>}
          </>
        )}
      </div>
    </div>
  );

  // body 최상단에 강제 렌더링 (다른 요소 영향 완전 차단)
  const portalTarget = document.getElementById("modal-root") || document.body;
  return ReactDOM.createPortal(modal, portalTarget);
}

export default MissionSubmit;
