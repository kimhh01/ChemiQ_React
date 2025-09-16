// src/PartnerShip/ProfileImageUpload.js
import React, { useState } from "react";
import api from "./Api/api";

function ProfileImageUpload({ onClose }) {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // 파일 선택 핸들러
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // 업로드 처리
  const handleUpload = async () => {
    if (!file) {
      alert("업로드할 이미지를 선택해주세요.");
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ 서버에 filename 전달 → presignedUrl, fileKey 받기
      const presignRes = await api.post("/members/me/profile-image/presigned-url", {
        filename: file.name,
      });

      if (presignRes.status === 200) {
        const { presignedUrl, fileKey } = presignRes.data;

        // 2️⃣ presignedUrl로 S3에 업로드
        await fetch(presignedUrl, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type,
          },
        });

        // 3️⃣ 업로드 완료 알림 (fileKey 전달)
        const completeRes = await api.post("/members/me/profile-image", {
          fileKey,
        });

        if (completeRes.status === 200) {
          setMessage("프로필 이미지가 성공적으로 수정되었습니다.");
        }
      }
    } catch (err) {
      console.error("업로드 실패:", err);
      setMessage("업로드 중 오류가 발생했습니다.");
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
        <h3>프로필 사진 수정</h3>

        <input type="file" accept="image/*" onChange={handleFileChange} />
        <div style={{ marginTop: "15px" }}>
          <button onClick={handleUpload} disabled={loading}>
            {loading ? "업로드 중..." : "업로드"}
          </button>
          <button onClick={onClose} style={{ marginLeft: "10px" }}>
            닫기
          </button>
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

export default ProfileImageUpload;
