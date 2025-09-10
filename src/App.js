import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login/Login";
import SignUp from "./Login/SignUp";
import Home from "./Page/Home";
import PartnerPage from "./Page/PartnerPage";
import MyPage from "./Page/MyPage"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<Home />} />
        <Route path="/partners" element={<PartnerPage />} />
        <Route path="/mypage" element={<MyPage/>} />
      </Routes>
    </Router>
  );
}

export default App;
