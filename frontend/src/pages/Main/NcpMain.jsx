import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import styled from "styled-components";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import RankChart from "../../components/Charts/RankChart";
import axios from "axios";
import useResponsive from "../../hooks/useResponsive";

const NcaMain = () => {
  const navigate = useNavigate();
  const [rankingData, setRankingData] = useState([]);

  useEffect(() => {
    if (rankingData.length === 0) {
      getRankingData();
    }
  }, []);

  const getRankingData = async () => {
    const response = await axios
      .post(`/ranking/v2`, {
        title: "NCP",
      })
      .catch(err => {
        console.log(err);
      });

    setRankingData(response.data);
  };

  // Slider 세팅 (lazyload)
  const settings = {
    dots: true,
    lazyload: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 2,
    waitForAnimate: false,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1130,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  // 반응형
  const { windowWidth, isMobile, isTablet, isDesktop, getDeviceType } =
    useResponsive();

  return (
    <>
      <Slider {...settings}>
        <RankChart
          rowData={rankingData.NCP200first}
          chartTitle={"NCP200 1회차 랭킹 🏆"}
        />
        <RankChart
          rowData={rankingData.NCP200last}
          chartTitle={"NCP200 다회차 랭킹 🏆"}
        />
        <RankChart
          rowData={rankingData.NCP202first}
          chartTitle={"NCP202 1회차 랭킹 🏆"}
        />
        <RankChart
          rowData={rankingData.NCP202last}
          chartTitle={"NCP202 다회차 랭킹 🏆"}
        />
        <RankChart
          rowData={rankingData.NCP207first}
          chartTitle={"NCP207 1회차 랭킹 🏆"}
        />
        <RankChart
          rowData={rankingData.NCP207last}
          chartTitle={"NCP207 다회차 랭킹 🏆"}
        />
      </Slider>
      {isMobile && (
        <MobileContainer>
          <div className="button-box">
            <h3>NCP200</h3>
            <button onClick={() => navigate(`/NCP200/practice`)}>
              연습문제
            </button>
            <button>실전 모의고사</button>
          </div>
          <div className="button-box">
            <h3>NCP202</h3>
            <button onClick={() => navigate(`/NCP202/practice`)}>
              연습문제
            </button>
            <button>실전 모의고사</button>
          </div>
          <div className="button-box">
            <h3>NCP207</h3>
            <button onClick={() => navigate(`/NCP207/practice`)}>
              연습문제
            </button>
            <button>실전 모의고사</button>
          </div>
          <div style={{ marginTop: "2rem" }}>광고ㅎ</div>
        </MobileContainer>
      )}
      {isTablet && (
        <TabletContainer>
          <TabletBody>
            <div className="button-box">
              <h3>NCP200</h3>
              <button onClick={() => navigate(`/NCP200/practice`)}>
                연습문제
              </button>
              <button>실전 모의고사</button>
            </div>
            <div className="button-box">
              <h3>NCP202</h3>
              <button onClick={() => navigate(`/NCP202/practice`)}>
                연습문제
              </button>
              <button>실전 모의고사</button>
            </div>
            <div className="button-box">
              <h3>NCP207</h3>
              <button onClick={() => navigate(`/NCP207/practice`)}>
                연습문제
              </button>
              <button>실전 모의고사</button>
            </div>
          </TabletBody>
          <AdContainer>광고ㅎ</AdContainer>
        </TabletContainer>
      )}
      {isDesktop && (
        <DesktopContainer>
          <DesktopBody>
            <div className="button-box">
              <h3>NCP200</h3>
              <button onClick={() => navigate(`/NCP200/practice`)}>
                연습문제
              </button>
              <button>실전 모의고사</button>
            </div>
            <div className="button-box">
              <h3>NCP202</h3>
              <button onClick={() => navigate(`/NCP202/practice`)}>
                연습문제
              </button>
              <button>실전 모의고사</button>
            </div>
            <div className="button-box">
              <h3>NCP207</h3>
              <button onClick={() => navigate(`/NCP207/practice`)}>
                연습문제
              </button>
              <button>실전 모의고사</button>
            </div>
          </DesktopBody>
          <AdContainer>광고ㅎ</AdContainer>
        </DesktopContainer>
      )}
    </>
  );
};

export default NcaMain;

const MobileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 5rem 0;

  .button-box {
    min-width: 40rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 1rem 0;
  }

  button {
    width: 10rem;
    background-color: #02c95f;
    font-size: 1rem;
    margin: 1rem 0;
  }
`;

const TabletContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const TabletBody = styled.div`
  display: flex;
  justify-content: center;
  margin: 3rem 0;

  .button-box {
    min-width: 25rem;
    max-height: 10rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
  }

  button {
    width: 15rem;
    background-color: #02c95f;
    font-size: 2rem;
    margin: 0.5rem 0;
  }
`;

const DesktopContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const DesktopBody = styled.div`
  display: flex;
  justify-content: center;
  margin: 3rem 0;

  .button-box {
    min-width: 20rem;
    max-height: 10rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
  }

  button {
    width: 15rem;
    background-color: #02c95f;
    font-size: 2rem;
    margin: 0.5rem 0;
  }
`;

const AdContainer = styled.div`
  display: flex;
  justify-content: center;
`;
