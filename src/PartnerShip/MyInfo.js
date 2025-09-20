// src/MyInfo.js
import React, { useState, useEffect } from "react";
import api from "../Api/api";

function MyInfo({ onLoad }) { // ✅ props 추가
  const [info, setInfo] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await api.get("/members/me/info");
        if (res.status === 200) {
          setInfo(res.data);
          setError("");

          // ✅ Home.js로 데이터 전달
          if (onLoad) {
            onLoad(res.data.myInfo);
          }
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError("회원을 찾을 수 없습니다.");
        } else {
          setError("서버와의 통신 중 문제가 발생했습니다.");
        }
      }
    };

    fetchInfo();
  }, [onLoad]);

  return (
    <div style={{ margin: "20px" }}>
      <h2>내 정보 조회</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {info && (
        <div style={{ marginTop: "15px" }}>
          <h3>My Info</h3>
          <p>회원 ID: {info.myInfo.memberId}</p>
          <p>닉네임: {info.myInfo.nickname}</p>
          <p>가입일: {info.myInfo.created}</p>
          <p>
            프로필 이미지:{" "}
            <img
              src={info.myInfo.profileImageUrl}
              alt="프로필"
              style={{ width: "60px", borderRadius: "50%" }}
            />
          </p>

          {info.partnerInfo && (
            <>
              <h3>Partner Info</h3>
              <p>회원 ID: {info.partnerInfo.memberId}</p>
              <p>닉네임: {info.partnerInfo.nickname}</p>
              <p>가입일: {info.partnerInfo.created}</p>
              <p>
                프로필 이미지:{" "}
                <img
                  src={info.partnerInfo.profileImageUrl}
                  alt="파트너 프로필"
                  style={{ width: "60px", borderRadius: "50%" }}
                />
              </p>
            </>
          )}

          {info.partnershipInfo && (
            <>
              <h3>Partnership Info</h3>
              <p>Streak Count: {info.partnershipInfo.streakCount}</p>
              <p>Chemi Score: {info.partnershipInfo.chemiScore}</p>
              <p>Accepted At: {info.partnershipInfo.acceptedAt}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default MyInfo;
