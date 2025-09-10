import React, { useState } from 'react';
import { sendPartnerRequest } from '../Api/partnerApi';

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
    <div style={{ padding: '20px' }}>
      <h2>파트너 요청</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="string"
          placeholder="파트너 ID 입력"
          value={partnerId}
          onChange={(e) => setPartnerId(e.target.value)}
          style={{ padding: '8px', width: '200px' }}
        />
        <button type="submit" style={{ padding: '8px 16px', marginLeft: '8px' }}>
          요청 보내기
        </button>
      </form>
      {message && <p style={{ marginTop: '10px' }}>{message}</p>}
    </div>
  );
}

export default PartnerRequests;
