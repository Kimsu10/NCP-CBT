import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";

const OneOnOne = ({ username }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showTypeButtons, setShowTypeButtons] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const typeButtonsRef = useRef(null);
  const socketRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    socketRef.current = io("http://localhost:4000", {
      path: "/quiz",
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  // 과목 선택
  const handleImageClick = imageName => {
    setSelectedImage(imageName);

    if (imageName === "NCP") {
      setShowTypeButtons(true);
    } else {
      setShowTypeButtons(false);
    }
  };

  const handleButtonClick = type => {
    setSelectedImage(`NCP${type}`);
    setShowTypeButtons(false);
  };

  // 방 생성
  const handleRoomCreation = () => {
    const roomId = Math.random().toString(36).substring(2, 10);
    const token = sessionStorage.getItem("accessToken");

    console.log("방 생성:", roomId);
    setRoomName(roomId);

    socketRef.current.emit("createRoom", {
      roomName: roomId,
      selectedName: selectedImage,
      token: token,
    });

    navigate(`/1on1/${selectedImage}/${roomId}`);
  };

  // 과목 선택시 모달이외 선택시 모달 닫힘
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
          <button className="make-room" onClick={handleRoomCreation}>
            방만들기
          </button>
        </MatchButtonBox>
      </OneOnOneBody>
    </>
  );
};

export default OneOnOne;

const OneOnOneBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 6rem 0;
  padding: 0 4rem;
  min-height: 80vh;

  .subject-title {
    margin-top: 2rem;
  }

  .room-id {
    margin: 2rem 0;
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

  .cancel-match,
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

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalBox = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;

  h2 {
    margin-bottom: 1rem;
  }

  input {
    width: 12rem;
    padding: 0.5rem;
    font-size: 1rem;
  }

  button {
    padding: 0.5rem 1rem;
    font-size: 1rem;
    background-color: lightseagreen;
    color: white;
    border: none;
    cursor: pointer;
  }
`;
