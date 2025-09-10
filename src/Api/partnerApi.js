import api from './api'; // 토큰 자동 갱신 포함된 axios 인스턴스

export const sendPartnerRequest = async (partnerId) => {
  try {
    // 실제 서버의 파트너 요청 URL
    const response = await api.post('/partnerships/requests', { partnerId });

    if (response.status === 201) {
      return { success: true, message: '파트너 요청이 성공적으로 전송되었습니다.' };
    }
  } catch (error) {
    if (!error.response) {
      return { success: false, message: '서버와 연결할 수 없습니다.' };
    }

    const status = error.response.status;

    switch (status) {
      case 400:
        return { success: false, message: '잘못된 요청입니다.' };
      case 404:
        return { success: false, message: '사용자를 찾을 수 없습니다.' };
      case 409:
        return { success: false, message: '이미 파트너 관계이거나 처리 대기중인 요청이 존재합니다.' };
      default:
        return { success: false, message: '알 수 없는 오류가 발생했습니다.' };
    }
  }
};
