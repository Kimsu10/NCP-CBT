import React, { useEffect, useState } from "react";
import styled from "styled-components";
import socket from "../../utils/socket";
import { useParams } from "react-router-dom";

const MatchWaiting = () => {
  const [participants, setParticipants] = useState([]);
  const param = useParams();
  const roomId = param.roomName;

  useEffect(() => {
    socket.on("waitingUsers", users => {
      setParticipants(users);
    });

    return () => {
      socket.off("waitingUsers");
    };
  }, []);

  return (
    <>
      <WaitingContainer>
        <h1>{roomId}</h1>
        <h1 className="waiting-user">대 기 인 원 : {participants.length}</h1>
        <div className="participants_list">
          {participants.map((user, idx) => (
            <h4 key={idx}>{user}</h4>
          ))}
        </div>
        <div clasName="row-button-box">
          <button className="start-button">시작하기</button>
          <button className="cancel-button">나가기</button>
        </div>
      </WaitingContainer>
    </>
  );
};

export default MatchWaiting;

const WaitingContainer = styled.div`
  margin-top: 8rem;
  min-width: 34rem;
  min-height: 78vh;
  text-align: center;

  .waiting-user {
    font-size: 1.2rem;
    margin: 1rem 0;
  }

  .participants_list {
    display: flex;
    align-items: center;
    gap: 8rem;
    justify-content: center;
    font-size: 1.4rem;
    min-height: 44rem;
  }

  .row-button-box {
    width: 34rem;
    margin: 10rem;
    display: flex;
    gap: 20px;
  }
`;
