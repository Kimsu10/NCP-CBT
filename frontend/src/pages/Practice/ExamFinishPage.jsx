import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Confetti from "react-confetti";
import useDebouncedWinSize from "../../hooks/useDebounceWinSize";
import { useNavigate, useParams } from "react-router-dom";
import NotFound from "../NotFound/NotFound";

const ExamFinishPage = () => {
  const navigate = useNavigate();
  const { width, height } = useDebouncedWinSize();
  const [numberOfPieces, setNumberOfPieces] = useState(60);
  const [username, setUsername] = useState("");
  const token = sessionStorage.getItem("accessToken");

  useEffect(() => {
    if (token) {
      const payload = token.split(".")[1];
      const decodedPayload = JSON.parse(atob(payload));

      setUsername(decodedPayload.sub);
    }
  }, [token]);

  const signature = username.split("").join(" ");

  const param = useParams();
  const subjectName = param.name;

  useEffect(() => {
    const timer = setTimeout(() => {
      setNumberOfPieces(0);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  if (!token) {
    return <NotFound />;
  }

  return (
    <>
      <Confetti
        width={width - 80}
        height={height}
        wind={0.03}
        numberOfPieces={numberOfPieces}
        opacity={0.7}
        drawShape={ctx => {
          const numPoints = 5;
          const outerRadius = 15;
          const innerRadius = 7;
          const step = (Math.PI * 2) / numPoints;

          ctx.beginPath();
          for (let i = 0; i < numPoints * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = step * i;
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);
            ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.fill();
        }}
      />
      <FinishContainer>
        <FinishTitle>축 하 합 니 다</FinishTitle>
        <CertificateImageBox>
          <CertificateImage src="/images/certificate.png" />
          <h1 className="user-name">{signature}</h1>
        </CertificateImageBox>
        <MoveControlBox>
          <button onClick={() => navigate(`/${subjectName}/exam`)}>
            다시 풀기
          </button>
          <button onClick={() => navigate("/")}>메인페이지</button>
        </MoveControlBox>
      </FinishContainer>
    </>
  );
};

export default ExamFinishPage;

const FinishContainer = styled.div`
  position: relative;
  width: 100%;
  height: 87vh;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 6rem 0;
`;

const FinishTitle = styled.h1`
  margin: 4rem 0;
`;

const CertificateImageBox = styled.div`
  position: relative;

  .user-name {
    position: absolute;
    top: 65%;
    right: 14%;
    color: black;
    font-family: "Qwitcher Grypen", cursive;
    font-weight: 700;
    font-size: 2.5rem;
  }
`;

const CertificateImage = styled.img`
  width: 600px;
  height: auto;
  border-radius: 6px;
  position: relative;
  margin-bottom: 2rem;
`;

const MoveControlBox = styled.div`
  gap: 2rem;
  display: flex;
  align-items: center;
  margin: 0 auto;

  button {
    width: 10rem;
    background-color: ${props => props.theme.mainColor};

    &:hover {
      background-color: ${props => props.theme.mainColor2};
    }
  }
`;
