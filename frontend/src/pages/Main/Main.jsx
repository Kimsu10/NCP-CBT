import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Main = () => {
  const navigate = useNavigate();

  const handleMovePractice = name => {
    navigate(`/${name}/practice`);
  };

  // 네이버 로그인 핸들러 (네이버에서 받은 인가코드를 백으로 전송 -> 백에서 인증완료된 JWT 토큰을 받는다)
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");
  const state = urlParams.get("state");

  useEffect(() => {
    if (code !== null && state !== null) {
      handleNaverLogin(code, state);
    }
    if (code !== null && state === null) {
      handleGithubLogin(code);
    }
  }, []);

  const handleNaverLogin = async (code, state) => {
    const response = await fetch("http://localhost:8080/login/naver", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code, state }),
    });

    if (response.status === 400) {
      navigate("/");
      alert("사용자 정보가 없습니다. 로그인을 다시 시도해주세요.");
    }

    if (response.status === 200) {
      // accessToken을 세션 스토리지에 저장 (추후 변경 가능성 있음)
      const data = await response.headers.get("Authorization");
      const accessToken = data.split(" ")[1];
      sessionStorage.setItem("accessToken", accessToken);
      navigate("/");
      window.location.reload();
    } else {
      console.error("Failed to fetch token");
    }
  };

  // 깃허브 로그인 핸들러
  const handleGithubLogin = async code => {
    const response = await fetch("http://localhost:8080/login/github", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    });

    if (response.status === 400) {
      navigate("/");
      alert("사용자 정보가 없습니다. 로그인을 다시 시도해주세요.");
    }

    if (response.status === 200) {
      // accessToken을 세션 스토리지에 저장 (추후 변경 가능성 있음)
      const data = await response.headers.get("Authorization");
      console.log(response.headers.getSetCookie);
      const accessToken = data.split(" ")[1];
      sessionStorage.setItem("accessToken", accessToken);
      navigate("/");
      window.location.reload();
    } else {
      console.error("Failed to fetch token");
    }
  };

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
