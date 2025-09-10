// api.js
import axios from "axios";

// axios 인스턴스 생성
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // 서버 주소
  withCredentials: true, // refresh token 쿠키 전달을 위해 필요할 수 있음
});

// 요청 인터셉터 - 매 요청마다 Access Token 추가
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 - 401 발생 시 토큰 재발급 처리
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Access Token 만료 시
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Refresh Token으로 새로운 Access Token 요청
        const res = await axios.post(api.defaults.baseURL+'reissue', null, {
          withCredentials: true, // refresh token이 쿠키에 저장된 경우 필요
        });

        const newAccessToken = res.data.accessToken;

        // 새 토큰 저장
        localStorage.setItem("accessToken", newAccessToken);

        // 원래 요청에 새로운 토큰 넣고 재요청
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("리프레시 토큰도 만료됨 → 로그아웃 필요");
        localStorage.removeItem("accessToken");
        window.location.href = "/login"; // 로그인 페이지로 이동
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
