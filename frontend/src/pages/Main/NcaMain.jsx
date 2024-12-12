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
      .post(`${process.env.REACT_APP_BASE_URL}/ranking/v2`, {
        title: "NCA",
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
    responsive: [
      {
        breakpoint: 1366,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          autoplay: true,
          autoplaySpeed: 3000,
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
          rowData={rankingData.NCAfirst}
          chartTitle={"NCA 1회차 랭킹 🏆"}
        />
        <RankChart
          rowData={rankingData.NCAlast}
          chartTitle={"NCA 다회차 랭킹 🏆"}
        />
      </Slider>
      {isMobile && (
        <MobileContainer>
          <div className="button-box">
            <button onClick={() => navigate(`/NCA/practice`)}>연습문제</button>
            <button onClick={() => navigate(`/NCA/exam`)}>실전 모의고사</button>
          </div>
        </MobileContainer>
      )}
      {isTablet && (
        <MainContainer>
          <ButtonBox>
            <Button onClick={() => navigate(`/NCA/practice`)}>연습문제</Button>
            <Button onClick={() => navigate(`/NCA/exam`)}>실전 모의고사</Button>
          </ButtonBox>
        </MainContainer>
      )}
      {isDesktop && (
        <MainContainer>
          <ButtonBox>
            <Button onClick={() => navigate(`/NCA/practice`)}>연습문제</Button>
            <Button onClick={() => navigate(`/NCA/exam`)}>실전 모의고사</Button>
          </ButtonBox>
        </MainContainer>
      )}
    </>
  );
};

export default NcaMain;

const MobileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 3rem 0;

  .button-box {
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

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 5rem 0;
  min-height: 19vh;
`;

const ButtonBox = styled.div`
  min-width: 35rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Button = styled.button`
  width: 15rem;
  background-color: #02c95f;
  font-size: 2rem;
`;
