import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

const NcpMain = () => {
  const navigate = useNavigate();

  return (
    <SubjectMain>
      {/* 밑에는 테스트시 빨리 이동하려고 만든거라 메인 시작하면 지워주세요 */}
      <MovePractice onClick={() => navigate(`/NCP200/practice`)}>
        NCP200 연습
      </MovePractice>
    </SubjectMain>
  );
};

export default NcpMain;

const SubjectMain = styled.div`
  margin-top: 6rem;
`;

const MovePractice = styled.button``;
