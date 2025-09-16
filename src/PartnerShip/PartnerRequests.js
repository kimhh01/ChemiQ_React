import React, { useState } from 'react';
import { sendPartnerRequest } from '../Api/partnerApi';
import './PartnerRequests.css'; // ✅ CSS 임포트

function PartnerRequests() {
  const [partnerId, setPartnerId] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!partnerId.trim()) {
      setMessage('파트너 ID를 입력해주세요.');
      return;
    }

    const result = await sendPartnerRequest(partnerId.trim());
    setMessage(result.message);
  };

  return (
    <div className="partner-requests">
      <h2>파트너 요청</h2>
      <form onSubmit={handleSubmit} className="partner-form">
        <input
          type="text"
          placeholder="파트너 ID 입력"
          value={partnerId}
          onChange={(e) => setPartnerId(e.target.value)}
          className="partner-input"
        />
        <button type="submit" className="partner-submit">
          요청 보내기
        </button>
      </form>
      {message && <p className="partner-message">{message}</p>}
    </div>
  );
}

export default PartnerRequests;
