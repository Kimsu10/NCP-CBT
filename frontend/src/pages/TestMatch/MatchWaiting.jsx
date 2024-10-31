import React, { useEffect, useState } from "react";
import styled from "styled-components";
import io from "socket.io-client";

const MatchWaiting = ({ roomId }) => {
  const [participants, setParticipants] = useState([]);
  console.log(participants);

  useEffect(() => {
    const socket = io("http://localhost:4000", {
      path: "/1on1",
    });

    const username = "사용자이름";
    const roomName = roomId;

    socket.on("waitingUsers", users => {
      setParticipants(users);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <WaitingContainer>
        <h1 className="room_name">대 기 인 원 : {participants.length}</h1>
        <div className="participants_list">
          {participants.map((user, index) => (
            <h4 key={index}>{user}</h4>
          ))}
        </div>
      </WaitingContainer>
    </>
  );
};

export default MatchWaiting;

const WaitingContainer = styled.div`
  min-width: 34rem;
  min-height: 32rem;
  text-align: center;

  .room_name {
    font-size: 1.2rem;
    margin: 1rem 0;
  }

  .participants_list {
    display: flex;
    align-items: center;
    gap: 8rem;
    justify-content: center;
    font-size: 1.4rem;
  }

  .vertical-line {
    border: 2px solid black;
    height: 100%;
  }
`;
