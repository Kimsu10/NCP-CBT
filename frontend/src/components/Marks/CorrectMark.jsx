import styled from "styled-components";

const CorrectMark = () => {
  return (
    <SVGContainer>
      <svg viewBox="16 1 70 110">
        <ellipse cx="50" cy="30" rx="45" ry="30" />
      </svg>
    </SVGContainer>
  );
};

export default CorrectMark;

const SVGContainer = styled.div`
  width: 4.5rem;
  height: 5rem;
  position: absolute;
  top: -1.9rem;
  left: -2.5rem;
  transform: rotate(130deg);

  svg {
    width: 100%;
    height: 100%;
  }

  ellipse {
    fill: none;
    stroke: red;
    stroke-width: 4;
    stroke-dasharray: 283;
    stroke-dashoffset: 283;
    animation: drawEllipse 0.8s ease-in-out forwards;
  }

  @keyframes drawEllipse {
    100% {
      stroke-dashoffset: 0;
    }
  }
`;
