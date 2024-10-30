import React from "react";
import styled from "styled-components";

const MatchWaiting = () => {
  return (
    <>
      <WaitingContainer>
        <h1 className="room_name">Room Id 들어올 곳</h1>
        <div className="participants_list">
          <h4> 멍멍이 </h4>
          <hr className="vertical-line" />
          <h4> 고양이</h4>
        </div>
      </WaitingContainer>
    </>
  );
};

export default MatchWaiting;

const WaitingContainer = styled.div`
  min-width: 34rem;
  min-height: 80rem;

  .room_name {
    font-size: 1.2rem;
  }

  .participants_list {
    display: flex;
    flex: 1;
  }
`;
