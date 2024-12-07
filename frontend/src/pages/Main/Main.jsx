import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import styled from "styled-components";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import useResponsive from "../../hooks/useResponsive";

const Main = () => {
  const navigate = useNavigate();

  const handleMovePractice = name => {
    navigate(`/${name}`);
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
      credentials: "include",
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
      // 쿠키도 추가해야해 !!!!!
      response.headers.get("Set-Cookie");
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
      credentials: "include",
      body: JSON.stringify({ code }),
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
      // 쿠키도 추가해야해 !!!!!
      response.headers.get("Set-Cookie");

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

  // Slider 세팅 (lazyload)
  const settings = {
    dots: true,
    lazyload: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    waitForAnimate: false,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  // 반응형
  const { windowWidth, isMobile, isTablet, isDesktop, getDeviceType } =
    useResponsive();

  return (
    <>
      <SlideContainer>
        <Slider {...settings}>
          <div>
            <img
              src="../../../../images/NAVER-NCBT.png"
              style={{ width: "100%" }}
            />
          </div>
          <div>
            <a
              href="https://bizschool.naver.com/online/courses/76?order=RECENT"
              target="_blank"
            >
              <img
                src="../../../../images/NAVER-edu-link.png"
                style={{ width: "100%" }}
              />
            </a>
          </div>
          <div>
            <a href="https://edu.ncloud.com/certi" target="_blank">
              <img
                src="../../../../images/NAVER-test-link.png"
                style={{ width: "100%" }}
              />
            </a>
          </div>
        </Slider>
      </SlideContainer>
      {isMobile && (
        <MobileContainer>
          <div className="subject-button-box">
            <button className="nca" onClick={() => handleMovePractice("NCA")}>
              NCA
            </button>
            <button className="ncp" onClick={() => handleMovePractice("NCP")}>
              NCP
            </button>
            <button className="nce" onClick={() => handleMovePractice("NCE")}>
              1 on 1
            </button>
          </div>
        </MobileContainer>
      )}
      {isTablet && (
        <DesktopContainer>
          <div className="subject-button-box">
            <button className="nca" onClick={() => handleMovePractice("NCA")}>
              NCA
            </button>
            <button className="ncp" onClick={() => handleMovePractice("NCP")}>
              NCP
            </button>
            <button className="nce" onClick={() => handleMovePractice("NCE")}>
              1 on 1
            </button>
          </div>
        </DesktopContainer>
      )}
      {isDesktop && (
        <DesktopContainer>
          <div className="subject-button-box">
            <button className="nca" onClick={() => handleMovePractice("NCA")}>
              NCA
            </button>
            <button className="ncp" onClick={() => handleMovePractice("NCP")}>
              NCP
            </button>
            <button className="nce" onClick={() => handleMovePractice("NCE")}>
              1 on 1
            </button>
          </div>
        </DesktopContainer>
      )}
    </>
  );
};
export default Main;

const SlideContainer = styled.div`
  margin: 5rem 0;
`;

const MobileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 5rem 0;

  .subject-button-box {
    min-width: 40rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  button {
    width: 10rem;
    background-color: #02c95f;
    font-size: 1rem;
    margin: 1rem 0;
  }
`;

const DesktopContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 5rem 0;

  .subject-button-box {
    min-width: 50rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  button {
    width: 15rem;
    background-color: #02c95f;
    font-size: 3rem;
  }
`;
