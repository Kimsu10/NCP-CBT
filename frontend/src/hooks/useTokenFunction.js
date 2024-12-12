import axios from "axios";
import { useNavigate } from "react-router-dom";

const useTokenFunction = () => {
  const navigate = useNavigate();

  const updateToken = async subjectName => {
    const refreshToken = getCookie("refreshToken");

    if (refreshToken) {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/refreshToken`,
          { refreshToken },
          { withCredentials: true },
        );

        const newAccessToken = response.data.accessToken;

        sessionStorage.setItem("accessToken", newAccessToken);
      } catch (error) {
        navigate(`/${subjectName}/who-are-you`);
      }
    }
  };

  const getCookie = name => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  return {
    getCookie,
    updateToken,
  };
};

export default useTokenFunction;
