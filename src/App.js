import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login/Login";
import SignUp from "./Login/SignUp";
import Home from "./Page/Home";
import PartnerPage from "./Page/PartnerPage";
import MyPage from "./Page/MyPage"
import ChangePassword from "./Change/ChangePassword";
import ChangeNickname from "./Change/ChangeNickname";
import MyInfo from "./PartnerShip/MyInfo";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<Home />} />
        <Route path="/partners" element={<PartnerPage />} />
        <Route path="/mypage" element={<MyPage/>} />
        <Route path="/password-change" element={<ChangePassword/>} />
        <Route path="/nickname-change" element={<ChangeNickname/>}/>
        <Route path="/myinfo" element={<MyInfo/>}/>
      </Routes>
    </Router>
  );
}

export default App;
