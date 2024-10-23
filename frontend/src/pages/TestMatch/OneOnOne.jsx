import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";

const socket = io("http://localhost:4000", {
  path: "/testMatch",
});

const OneOnOne = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [waiting, setWaiting] = useState(false); // 대기 상태
  const [isReady, setIsReady] = useState(false); // 방에 입장할 준비
  const [showTypeButtons, setShowTypeButtons] = useState(false); // NCP 이미지 클릭 시 버튼 보이기
  const typeButtonsRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("roomReady", roomName => {
      setIsReady(true);
      alert(`방에 입장할 준비가 완료되었습니다: ${roomName}`);
      navigate(`/${selectedImage}/1on1/${roomName}`);
    });
  }, [selectedImage, navigate]);

  useEffect(() => {
    const handleClickOutside = event => {
      if (
        typeButtonsRef.current &&
        !typeButtonsRef.current.contains(event.target)
      ) {
        setShowTypeButtons(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleImageClick = imageName => {
    setSelectedImage(imageName);

    if (imageName === "NCP") {
      setShowTypeButtons(true);
    } else {
      setShowTypeButtons(false);
    }
  };

  const handleRoomCreation = () => {
    setWaiting(true);
    socket.emit("createRoom", { roomName: "myRoom" });
  };

  const handleButtonClick = type => {
    setSelectedImage(`NCP${type}`);
    setShowTypeButtons(false);
  };

  return (
    <>
      <OneOnOneBody>
        {selectedImage ? (
          <h1 className="subject-title">{selectedImage}</h1>
        ) : (
          <h1 className="subject-title">과목을 선택하세요</h1>
        )}
        <ImageBox>
          <img
            src="/images/OneOnOne/nca.png"
            className={`nac-image ncp-card ${
              selectedImage === "NCA" ? "selected" : ""
            }`}
            alt="nca"
            onClick={() => handleImageClick("NCA")}
          />
          <div className="ncp-container">
            <img
              src="/images/OneOnOne/ncp.png"
              className={`ncp-image ncp-card ${
                selectedImage && selectedImage.includes("NCP") ? "selected" : ""
              }`}
              alt="ncp"
              onClick={() => handleImageClick("NCP")}
            />
            {showTypeButtons && (
              <div className="type-buttons" ref={typeButtonsRef}>
                <button onClick={() => handleButtonClick("200")}>NCP200</button>
                <button onClick={() => handleButtonClick("202")}>NCP202</button>
                <button onClick={() => handleButtonClick("207")}>NCP207</button>
              </div>
            )}
          </div>
          <img
            src="/images/OneOnOne/nce.png"
            className={`nce-image ncp-card ${
              selectedImage === "NCE" ? "selected" : ""
            }`}
            alt="nce"
            onClick={() => handleImageClick("NCE")}
          />
        </ImageBox>
        <MatchButtonBox>
          <button
            className="make-room"
            onClick={handleRoomCreation}
            disabled={waiting}
          >
            {waiting ? "대기 중..." : "방만들기"}
          </button>
          <button className="enter-room">입장하기</button>
        </MatchButtonBox>

        {isReady && <div>입장 준비 완료! 방으로 이동합니다.</div>}
      </OneOnOneBody>
    </>
  );
};

export default OneOnOne;

const OneOnOneBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 6rem 0;
  padding: 0 4rem;

  .subject-title {
    margin-top: 2rem;
  }
`;

const ImageBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 4rem 2rem;
  min-width: 28rem;

  @media (max-width: 720px) {
    flex-direction: column;
    margin: 2rem;
    gap: 1rem;
  }

  .nce-image,
  .nac-image {
    padding-top: 1rem;
    width: 28%;

    @media (max-width: 720px) {
      min-width: 20rem;
    }
  }

  .ncp-container {
    position: relative;
    width: 31.5%;

    @media (max-width: 720px) {
      min-width: 20rem;
    }
  }

  .ncp-image {
    padding-top: 1rem;
    width: 100%;
    position: relative;
  }

  .ncp-card {
    height: 100%;
    padding: 1rem;
    border-radius: 12px;
    background-color: #f1f1f1;

    &:hover {
      background-color: #ddd;
    }
  }

  .type-buttons {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 1rem;
    padding: 1rem;
    background-color: #80808096;
    border-radius: 10px;

    button {
      width: 100%;
      height: 28%;
      margin: 0.2rem 0;
      background-color: lightgray;
      border: none;
      padding: 0.5rem 1rem;
      font-size: 1.2rem;
      cursor: pointer;
    }

    button:hover {
      background-color: darkgray;
    }
  }

  .selected {
    background-color: #ddd;
    box-shadow: 0px 2px 2px 2px lightseagreen;
  }
`;

const MatchButtonBox = styled.div`
  display: flex;
  gap: 1rem;

  .enter-room,
  .make-room {
    width: 12rem;
    height: 4rem;
    font-size: 1.2rem;
    background-color: ${props => props.theme.mainColor};
  }

  @media (max-width: 720px) {
    flex-direction: column;
  }
`;
