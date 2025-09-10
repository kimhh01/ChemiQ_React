// src/pages/PartnerPage.js
import React from "react";
import PartnerRequests from "../PartnerShip/PartnerRequests";
import PartnershipSentlist from "../PartnerShip/PartnershipSentlist";
import PartnershipReceivedlist from "../PartnerShip/PartnershipRecivedlist";

function PartnerPage() {
  return (
    <div className="partner-page">
      <h2>파트너 요청 관리</h2>

      {/* 파트너 요청 보내기 */}
      <PartnerRequests />

      {/* 내가 보낸 요청 */}
      <PartnershipSentlist />

      {/* 내가 받은 요청 */}
      <PartnershipReceivedlist />
    </div>
  );
}

export default PartnerPage;
