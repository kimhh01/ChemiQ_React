// api.js
import axios from "axios";

// ─────────────────────────────────────────────────────────────
// ① 공통 유틸
// ─────────────────────────────────────────────────────────────
const getAccessToken = () => localStorage.getItem("accessToken");
const getRefreshToken = () => localStorage.getItem("refreshToken");

const setTokens = ({ accessToken, refreshToken }) => {
  if (accessToken) localStorage.setItem("accessToken", accessToken);
  if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
};

// 서버 응답에서 토큰을 최대한 유연하게 추출 (헤더/바디 모두 시도)
const extractTokens = (res) => {
  // 1) 헤더에서 시도
  // ⚠️ 서버가 CORS에 'Access-Control-Expose-Headers: Authorization'을 설정하지 않으면
  //    브라우저에서 아래 값은 읽히지 않습니다.
  const headerAuth =
    res?.headers?.authorization || res?.headers?.Authorization || null;
  const accessFromHeader =
    headerAuth && headerAuth.startsWith("Bearer ")
      ? headerAuth.slice(7)
      : headerAuth || null;

  // 2) 바디에서 시도 (백엔드가 바디로 내려주는 경우 대비)
  const body = res?.data || {};
  const accessFromBody =
    body.accessToken || body.access_token || body.token || null;
  const refreshFromBody =
    body.refreshToken ||
    body.refresh_token ||
    body.newRefreshToken ||
    null;

  return {
    accessToken: accessFromHeader || accessFromBody || null,
    refreshToken: refreshFromBody,
  };
};

// ─────────────────────────────────────────────────────────────
// ② Axios 인스턴스
// ─────────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: (process.env.REACT_APP_API_URL || "").replace(/\/+$/, ""), // 뒤 슬래시 제거
  withCredentials: true,
});

// ─────────────────────────────────────────────────────────────
// ③ 요청 인터셉터: 매 요청에 Access Token 부착
// ─────────────────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();

    // /reissue 호출에는 굳이 만료된 access token을 실어 보낼 필요는 없음
    // (보내도 상관 없지만, 깔끔하게 제외)
    const isReissue = config.url?.includes("/reissue");

    if (accessToken && !isReissue) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─────────────────────────────────────────────────────────────
// ④ 응답 인터셉터: 401 처리 + 리프레시 큐잉
// ─────────────────────────────────────────────────────────────
let isRefreshing = false;                // 리프레시 중인지 여부
let refreshSubscribers = [];             // 리프레시 완료 대기 중인 요청 큐

const subscribeTokenRefresh = (cb) => refreshSubscribers.push(cb);
const onRefreshed = (newAccessToken) => {
  refreshSubscribers.forEach((cb) => cb(newAccessToken));
  refreshSubscribers = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error?.response?.status;

    // 네트워크 오류 등 status가 없는 케이스는 그대로 전달
    if (!status) return Promise.reject(error);

    const isReissueCall = originalRequest?.url?.includes("/reissue");

    // 401이고, 리트라이 한 번도 안 했고, 현재 요청이 /reissue가 아닐 때만 처리
    if (status === 401 && !originalRequest._retry && !isReissueCall) {
      originalRequest._retry = true;

      // 이미 다른 요청이 리프레시 중이면, 큐에 넣고 대기
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((newAccessToken) => {
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
            resolve(api(originalRequest));
          });
        });
      }

      // 여기서부터 리프레시 시작
      isRefreshing = true;
      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) throw new Error("NO_REFRESH_TOKEN");

        // 기본 axios로 직접 호출 (api 인스턴스의 인터셉터 영향 최소화)
        // ⚠️ 서버가 쿠키 기반이면 body는 무시되고, withCredentials=true 로 쿠키가 전송됨
        // ⚠️ 헤더로도 함께 보내는 케이스를 대비해 X-Refresh-Token 추가
        const refreshRes = await axios.post(
          `${api.defaults.baseURL}/reissue`,
          { refreshToken },
          {
            withCredentials: true,
            headers: { "X-Refresh-Token": refreshToken },
          }
        );

        // 새 토큰 추출 (헤더/바디 모두 시도)
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          extractTokens(refreshRes);

        if (!newAccessToken) {
          // 헤더가 CORS에 노출되지 않았거나, 서버가 바디로도 안 보내는 경우
          throw new Error("NO_ACCESS_FROM_REFRESH");
        }

        // 로컬 저장
        setTokens({ accessToken: newAccessToken, refreshToken: newRefreshToken });

        // 리프레시 대기 중인 요청들 모두 처리
        isRefreshing = false;
        onRefreshed(newAccessToken);

        // 원요청 재시도
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // 리프레시 실패 → 세션 정리 및 로그인 화면으로
        isRefreshing = false;
        refreshSubscribers = [];

        localStorage.setItem(
          "sessionExpiredMsg",
          "세션이 만료되었습니다. 다시 로그인해 주세요."
        );
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/";

        return Promise.reject(refreshError);
      }
    }

    // 그 외 에러는 그대로 전달
    return Promise.reject(error);
  }
);

export default api;
