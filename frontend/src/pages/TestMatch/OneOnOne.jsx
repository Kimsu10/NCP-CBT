import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import io from "socket.io-client";

import { useNavigate } from "react-router-dom";

const OneOnOne = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [waiting, setWaiting] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [showTypeButtons, setShowTypeButtons] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const typeButtonsRef = useRef(null);
  const modalRef = useRef(null);
  const socketRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    socketRef.current = io("http://localhost:4000", {
      path: "/1on1",
    });

    socketRef.current.on("roomReady", ({ roomName, selectedName }) => {
      console.log("Received roomReady event:", selectedName, roomName);
      setSelectedName(selectedName);
      setRoomName(roomName);
      setIsReady(true);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    console.log("selectedName 상태:", selectedName);
    console.log("roomName 상태:", roomName);
    console.log("isReady 상태:", isReady);

    if (isReady && selectedName && roomName) {
      // if (selectedName !== undefined && roomName !== undefined) {
      //   navigate(`/1on1/${selectedName}/${roomName}`);
      //   console.log("이동 준비 완료:", selectedName, roomName);
      // } else {
      //   console.error(
      //     "selectedName 또는 roomName이 설정되지 않았습니다.",
      //     selectedName,
      //     roomName,
      //   );
      // }
      const targetUrl = `/1on1/${selectedName}/${roomName}`; // 이동할 URL
      console.log("이동 준비 완료:", selectedName, roomName);
      console.log("이동할 URL:", targetUrl);
      navigate(targetUrl);
    }
  }, [isReady, roomName, selectedName, navigate]);

  // 과목 선택
  const handleImageClick = imageName => {
    setSelectedImage(imageName);

    if (imageName === "NCP") {
      setShowTypeButtons(true);
    } else {
      setShowTypeButtons(false);
    }
  };

  // 방생성 -> roomName, selectedName 서버에 잘 들어감
  const handleRoomCreation = () => {
    const roomId = Math.random().toString(36).substring(2, 10);
    console.log("방 생성:", roomId);
    setRoomName(roomId);
    setWaiting(true);

    socketRef.current.emit("createRoom", {
      roomName: roomId,
      selectedName: selectedImage,
    });
  };

  const handleButtonClick = type => {
    setSelectedImage(`NCP${type}`);
    setShowTypeButtons(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const handleRoomEnter = () => {
    if (roomName) {
      // 방 참가자가 서버에 입장 요청
      socketRef.current.emit("joinRoom", {
        roomName: roomName,
      });

      console.log("방 입장 요청:", selectedName, roomName);
    } else {
      alert("방 번호를 입력하세요.");
    }
  };

  useEffect(() => {
    const handleClickOutside = event => {
      if (
        typeButtonsRef.current &&
        !typeButtonsRef.current.contains(event.target)
      ) {
        setShowTypeButtons(false);
      }

      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalOpen(false);
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
          <button
            className="make-room"
            onClick={handleRoomCreation}
            disabled={waiting}
          >
            {waiting ? "대기 중..." : "방만들기"}
          </button>
          <button className="enter-room" onClick={openModal}>
            입장하기
          </button>
        </MatchButtonBox>

        {isReady && <div>입장 준비 완료! 방으로 이동합니다.</div>}

        {isModalOpen && (
          <ModalBackground>
            <ModalBox ref={modalRef}>
              <h2>방 번호를 입력하세요</h2>
              <input
                type="text"
                value={roomName}
                onChange={e => setRoomName(e.target.value)}
                placeholder="방 번호"
              />
              <button onClick={handleRoomEnter}>입장하기</button>
            </ModalBox>
          </ModalBackground>
        )}
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
