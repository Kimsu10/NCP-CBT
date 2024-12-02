import styled from "styled-components";

const WrongMark = () => {
  return (
    <SVGContainer>
      <svg viewBox="20 0 70 130">
        <ellipse cx="50" cy="30" rx="50" ry="1" />
      </svg>
    </SVGContainer>
  );
};

export default WrongMark;

const SVGContainer = styled.div`
  width: 4.5rem;
  height: 5rem;
  position: absolute;
  top: -0.4rem;
  left: -0.4rem;
  transform: rotate(-48deg);

  svg {
    width: 100%;
    height: 100%;
  }

  ellipse {
    fill: none;
    stroke: #ff0000d7;
    stroke-width: 4;
    stroke-dasharray: 283;
    stroke-dashoffset: 283;
    animation: drawEllipse 0.3s ease-in-out forwards;
  }

  @keyframes drawEllipse {
    100% {
      stroke-dashoffset: 0;
    }
  }
`;
