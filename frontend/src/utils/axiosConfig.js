import axios from "axios";

const axiosConfig = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  withCredentials: true,
});

axiosConfig.interceptors.request.use(
  async config => {
    const accessToken = sessionStorage.getItem("accessToken");
    const refreshToken = getCookie("refreshToken");

    // 액세스 토큰이 있는 경우
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    // 액세스 토큰이 없는데 리프레시 토큰이 있는 경우 : 서버로 재발행 요청 후 새로 받은 액세스 토큰을 요청 헤더에 추가.
    else if (refreshToken) {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/refreshToken`,
          { refreshToken },
          { withCredentials: true },
        );

        const newAccessToken = response.data.accessToken;

        sessionStorage.setItem("accessToken", newAccessToken);
        config.headers["Authorization"] = `Bearer ${newAccessToken}`;
      } catch (error) {
        return Promise.reject(
          new axios.Cancel("리프레시 토큰 갱신 실패.", error),
        );
      }
    }

    // 액세스, 리프레시 토큰 둘 다 없는 경우 : 사용자에게 로그인 요청!
    else {
      return Promise.reject(
        new axios.Cancel("토큰이 없습니다. 다시 로그인 해주세요"),
      );
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

export default axiosConfig;
