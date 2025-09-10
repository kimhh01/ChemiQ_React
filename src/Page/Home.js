import React from "react";
import { useNavigate } from "react-router-dom";
import PartnerInfo from "../PartnerShip/PartnerInfo";
import TodayMission from "../TodayMisson";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const serverUrl = process.env.REACT_APP_API_URL;

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        const response = await fetch(serverUrl + "/logout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });

        if (!response.ok) console.error("서버 로그아웃 실패");
        if (response.ok) alert("서버 로그아웃 성공");
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
      <div className="home-header">
        <div className="top-bar"></div>
        <h1>ChemiQ</h1>
        <div className="menu-buttons">
          <button onClick={() => navigate("/partners")}>파트너 관리</button>
          <button>메뉴1</button>
          <button>메뉴2</button>
          <button onClick={() => navigate("/mypage")}>마이페이지</button>
          <button onClick={handleLogout}>로그아웃</button>
        </div>
      </div>

      {/* PartnerInfo에 홈 화면이므로 버튼 숨기기 */}
      <PartnerInfo hideUnlinkButton={true} />
      <TodayMission />
    </div>
  );
}

export default Home;
