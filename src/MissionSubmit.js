// src/Mission/MissionSubmit.js
import React, { useState } from "react";
import api from "./Api/api"; // ✅ 경로 주의 (src/Api/api.js 안에 위치해야 함)

function MissionSubmit({ dailyMissionId, onClose }) {
  const [file, setFile] = useState(null);
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // 파일 선택 핸들러
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // 제출 처리
  const handleSubmit = async () => {
    if (!file) {
      alert("업로드할 이미지를 선택해주세요.");
      return;
    }
    if (!content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ presignedUrl 요청
      const presignRes = await api.post("/submissions/presigned-url", {
        filename: file.name,
      });

      if (presignRes.status === 200) {
        const { presignedUrl, fileKey } = presignRes.data;

        // 2️⃣ S3 업로드
        await fetch(presignedUrl, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type,
          },
        });

        // 3️⃣ 미션 제출 API 호출
        const completeRes = await api.post("/submissions", {
          dailyMissionId,
          content,
          fileKey,
        });

        if (completeRes.status === 200) {
          setMessage("✅ 미션이 성공적으로 제출되었습니다!");
        }
      }
    } catch (err) {
      console.error("미션 제출 실패:", err);

      if (err.response) {
        switch (err.response.status) {
          case 400:
            setMessage("❌ 잘못된 요청 데이터입니다.");
            break;
          case 401:
            setMessage("❌ 로그인이 필요합니다.");
            break;
          case 403:
            setMessage("❌ 해당 미션을 제출할 권한이 없습니다.");
            break;
          case 404:
            setMessage("❌ 존재하지 않는 미션 ID입니다.");
            break;
          case 409:
            setMessage("❌ 업로드 자격이 없습니다. (파트너 없음 / 오늘 미션 없음 / 이미 제출함)");
            break;
          case 500:
            setMessage("❌ 서버 내부 오류 (S3 통신 오류 등)");
            break;
          default:
            setMessage("❌ 미션 제출 중 알 수 없는 오류가 발생했습니다.");
        }
      } else {
        setMessage("❌ 서버와의 연결에 실패했습니다.");
      }
    } finally {
      setLoading(false);
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
        <h3>미션 제출</h3>

        {/* 파일 선택 */}
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <br />

        {/* 내용 입력 */}
        <textarea
          placeholder="내용을 입력하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ width: "100%", height: "80px", marginTop: "10px" }}
        />

        {/* 버튼 */}
        <div style={{ marginTop: "15px" }}>
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? "제출 중..." : "제출하기"}
          </button>
          <button onClick={onClose} style={{ marginLeft: "10px" }}>
            닫기
          </button>
        </div>

        {/* 메시지 */}
        {message && (
          <p
            style={{
              marginTop: "10px",
              color: message.includes("✅") ? "green" : "red",
            }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default MissionSubmit;
