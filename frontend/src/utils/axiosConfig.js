import axios from "axios";

const axiosConfig = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

axiosConfig.interceptors.request.use(
  config => {
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    } else {
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

export default axiosConfig;
