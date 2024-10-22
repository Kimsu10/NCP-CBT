import React, { useState } from "react";
import styled from "styled-components";

const OneOnOne = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageClick = imageName => {
    setSelectedImage(imageName);
  };

  return (
    <>
      <OneOnOneBody>
        <ImageBox>
          <img
            src="/images/OneOnOne/nca.png"
            className={`nac-image ncp-card ${selectedImage === "nca" ? "selected" : ""}`}
            alt="nca"
            onClick={() => handleImageClick("nca")}
          />
          <img
            src="/images/OneOnOne/ncp.png"
            className={`ncp-image ncp-card ${selectedImage === "ncp" ? "selected" : ""}`}
            alt="ncp"
            onClick={() => handleImageClick("ncp")}
          />
          <img
            src="/images/OneOnOne/nce.png"
            className={`nce-image ncp-card ${selectedImage === "nce" ? "selected" : ""}`}
            alt="nce"
            onClick={() => handleImageClick("nce")}
          />
        </ImageBox>
        <button className="make-room">방만들기</button>
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

  .make-room {
    width: 12rem;
    height: 4rem;
    font-size: 1.2rem;
    background-color: ${props => props.theme.mainColor};
  }
`;

const ImageBox = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 4rem 2rem;

  .nac-image {
    padding-top: 1rem;
    width: 28%;
  }
  .nce-image {
    width: 28%;
  }

  .ncp-image {
    padding-top: 1rem;
    width: 30%;
  }

  .ncp-card {
    padding: 1rem;
    border-radius: 12px;
    background-color: #f1f1f1;

    &:hover {
      background-color: #ddd;
    }
  }

  .selected {
    background-color: #ddd;
    box-shadow: 1px 2px 2px 0px lightseagreen;
  }
`;
