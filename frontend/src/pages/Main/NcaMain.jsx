import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import styled from "styled-components";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import RankChart from "../../components/Charts/RankChart";
import axiosConfig from "../../utils/axiosConfig";

const NcaMain = () => {
  const navigate = useNavigate();
  const [firstData, setFirstData] = useState([]);
  const [lastData, setLastData] = useState([]);
  const table = ["first_score", "last_score"];

  useEffect(() => {
    if (firstData.length === 0) {
      getRankingData(table[0]);
      getRankingData(table[1]);
    }
  }, []);

  const getRankingData = async tableName => {
    if (tableName === "first_score") {
      const response = await axiosConfig
        .post(`/ranking/v2`, {
          title: "NCA",
          table: tableName,
        })
        .catch(err => {
          console.log(err);
        });

      setFirstData(response.data);
    } else {
      const response = await axiosConfig
        .post(`/ranking/v2`, {
          title: "NCA",
          table: tableName,
        })
        .catch(err => {
          console.log(err);
        });

      setLastData(response.data);
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
      <Slider {...settings}>
        <RankChart rowData={firstData} chartTitle={"NCA 1회차 랭킹 🏆"} />
        <RankChart rowData={lastData} chartTitle={"NCA 다회차 랭킹 🏆"} />
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
