import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import styled from "styled-components";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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
    if (code !== null) {
      console.log("code?", code !== null);
      handleNaverLogin(code, state);
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
                alt="네이버 클라우드 플랫폼 공인 자격증 시험 링크"
                style={{ width: "100%" }}
              />
            </a>
          </div>
        </Slider>
      </SlideContainer>
      <MainContainer>
        <div className="subject-button-box">
          {/* 임시 설정 - 막 바꾸세시라우 */}
          <button className="nca" onClick={() => handleMovePractice("NCA")}>
            NCA
          </button>
          <button className="ncp" onClick={() => handleMovePractice("NCP")}>
            NCP
          </button>
          <button className="nce" onClick={() => handleMovePractice("NCE")}>
            NCE
          </button>
          <button className="nce" onClick={() => handleMovePractice("NCE")}>
            게임
          </button>
        </div>
      </MainContainer>
    </>
  );
};
export default Main;

const SlideContainer = styled.div`
  margin: 5rem 0;
`;

// 임시 설정 - 막 바꾸세오
const MainContainer = styled.div`
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
    width: 10rem;
    background-color: #02c95f;
    font-size: 3rem;
  }
`;
