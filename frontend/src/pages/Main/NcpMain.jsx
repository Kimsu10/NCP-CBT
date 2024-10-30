import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import styled from "styled-components";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import RankChart from "../../components/Charts/RankChart";
import axios from "axios";

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
      <MainContainer>
        <ButtonBox>
          <Button onClick={() => navigate(`/NCA/practice`)}>연습문제</Button>
          <Button>실전 모의고사</Button>
        </ButtonBox>
      </MainContainer>
    </>
  );
};

export default NcaMain;

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 5rem 0;
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
