import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Main = () => {
  const navigate = useNavigate();

  const handleMovePractice = name => {
    navigate(`/${name}/practice`);
  };

  // 네이버 로그인 핸들러
  const handleNaverLogin = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");

    const response = await fetch("http://localhost:8080/login/naver", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code, state }),
    });

    if (response.ok) {
      const data = await response.json();
      const accessToken = data.accessToken;

      // accessToken을 세션 스토리지에 저장 (추후 변경 가능성 있음)
      sessionStorage.setItem("token", accessToken);
    } else {
      console.error("Failed to fetch token");
    }
  };

  // useEffect 안에서 호출
  useEffect(() => {
    handleNaverLogin();
  }, []);

  // useEffect(() => {
  //   const corsTest = () => {
  //     axios
  //       .get("http://localhost:8080")
  //       .then(res => console.log(res))
  //       .catch(err => console.log(err));
  //   };
  //   corsTest();
  // }, []);

  return (
    <>
      <div>메인페이지</div>
      {/* 임시 버튼 -> 연습문제로 이동 */}
      <button className="nca" onClick={() => handleMovePractice("NCA")}>
        NCA
      </button>
      <button className="ncp" onClick={() => handleMovePractice("NCP")}>
        NCP
      </button>
      <button className="nce" onClick={() => handleMovePractice("NCE")}>
        NCE
      </button>
    </>
  );
};
export default Main;
