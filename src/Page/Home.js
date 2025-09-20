// src/Home/Home.js
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import PartnerInfo from "../PartnerShip/PartnerInfo";
import TodayMission from "../TodayMisson/TodayMisson";
import TodaymissionState from "../TodayMisson/TodaymissonState";
import MissionHistory from "../Mission/MissionHistory";

// ✅ 내 정보 API 사용
import api from "../Api/api";

import "./Home.css";

const DEFAULT_AVATAR =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'>
      <circle cx='40' cy='40' r='40' fill='#e2e8f0'/>
      <circle cx='40' cy='32' r='14' fill='#fff'/>
      <path d='M14 70a26 16 0 0 1 52 0z' fill='#fff'/>
    </svg>`
  );

function Home() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ nickname: "사용자", avatar: "" });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const headerRightRef = useRef(null);

  // ───────── 내 정보 불러오기 (/members/me/info) ─────────
  useEffect(() => {
    const fetchMyInfo = async () => {
      try {
        const res = await api.get("/members/me/info");
        if (res.status === 200 && res.data?.myInfo) {
          const { nickname, profileImageUrl } = res.data.myInfo;
          setProfile({
            nickname: nickname || "사용자",
            avatar: profileImageUrl || "",
          });
        }
      } catch (err) {
        console.error("내 정보 조회 실패:", err);
      }
    };
    fetchMyInfo();
  }, []);

  // ───────── 드롭다운 외부 클릭/ESC 닫기 ─────────
  useEffect(() => {
    const handleDocClick = (e) => {
      if (!dropdownOpen) return;
      if (headerRightRef.current && !headerRightRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    const handleKey = (e) => {
      if (e.key === "Escape") setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleDocClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleDocClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [dropdownOpen]);

  // ───────── 로그아웃 로직 ─────────
  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        await api.post("/logout", { refreshToken });
      }

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      alert("로그아웃 되었습니다.");
      navigate("/");
    } catch (error) {
      console.error("로그아웃 오류:", error);
      alert("로그아웃 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="home-container">
      {/* ───────── 상단 헤더 ───────── */}
      <div className="home-header">
        {/* 좌측: 로고 + 메뉴 */}
        <div className="header-left">
          <h1 onClick={() => navigate("/")}>ChemiQ</h1>
          <div className="menu-buttons">
            <button onClick={() => navigate("/partners")}>파트너 관리</button>
            <button>메뉴1</button>
            <button>메뉴2</button>
            <button>메뉴3</button>
          </div>
        </div>

        {/* 우측: 프로필 */}
        <div
          className="header-right"
          ref={headerRightRef}
          onClick={() => setDropdownOpen((v) => !v)}
        >
          <img
            src={profile.avatar || DEFAULT_AVATAR}
            alt="프로필"
            className="profile-pic"
          />
          <span className="nickname">{profile.nickname}</span>

          <div className={`dropdown-menu ${dropdownOpen ? "active" : ""}`}>
            <button onClick={() => navigate("/mypage")}>프로필 관리</button>
            <button onClick={handleLogout}>로그아웃</button>
          </div>
        </div>
      </div>

      {/* ───────── 본문 (좌/우 레이아웃) ───────── */}
      <div className="home-body">
        <section className="partner-section">
          <PartnerInfo hideUnlinkButton={true} />
        </section>

        <section className="mission-section">
          <div className="today-mission-section">
            <TodayMission />
          </div>
          <div className="today-state-section">
            <TodaymissionState />
          </div>
          <div className="mission-history-section">
            <MissionHistory />
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;
