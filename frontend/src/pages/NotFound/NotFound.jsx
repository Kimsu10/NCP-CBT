import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import AuthModal from "../../components/Modal/AuthModal";

const NotFound = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const navigate = useNavigate();

  const handleOpenModal = () => {
    setShowAuthModal(true);
  };

  const handleCloseModal = () => {
    setShowAuthModal(false);
  };

  return (
    <WhoAreYou>
      <div className="image-container">
        <div className={`sorry-content ${isHovered ? "hidden" : ""}`}>
          <h2 className="sorry-text">로그인 부탁드립니다</h2>
          <img src="/images/sorry.jpg" alt="sorry" className="sorry-image" />
        </div>
        <div className={`who-content ${isHovered ? "visible" : ""}`}>
          <h2 className="who-text">...</h2>
          <img src="/images/who.jpg" alt="who" className="who-image" />
        </div>
      </div>
      <div className="button-container">
        <button className="login-button" onClick={handleOpenModal}>
          로그인
        </button>
        <button
          className="go-to-main-button"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => navigate("/")}
        >
          돌아가기
        </button>
      </div>
      {showAuthModal && (
        <AuthModal type="login" closeModal={handleCloseModal} />
      )}
    </WhoAreYou>
  );
};

export default NotFound;

const WhoAreYou = styled.div`
  width: 100%;
  height: auto;
  min-height: 67vh;
  margin: 4rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;

  .image-container {
    position: relative;
    width: 36rem;
    height: 28rem;
    margin-bottom: 3rem;

    .sorry-content,
    .who-content {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      transition:
        opacity 0.3s ease-in-out,
        visibility 0.3s ease-in-out;

      h2 {
        margin-bottom: 2rem;
      }
    }

    .sorry-content {
      opacity: 1;
      visibility: visible;
    }

    .sorry-content.hidden {
      opacity: 0;
      visibility: hidden;
    }

    .who-content {
      opacity: 0;
      visibility: hidden;
    }

    .who-content.visible {
      opacity: 1;
      visibility: visible;
    }

    img {
      max-width: 70%;
      height: auto;
      border-radius: 8px;
    }
  }

  .button-container {
    display: flex;
    width: 24rem;
    justify-content: center;
    gap: 2rem;

    button {
      width: 12rem;
      font-size: 1.1rem;
    }
  }
`;
