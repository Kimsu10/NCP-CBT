import styled from "styled-components";

const CorrectMark = () => {
  return (
    <SVGContainer>
      <svg viewBox="0 0 100 100">
        <ellipse cx="50" cy="50" rx="45" ry="25" />
      </svg>
    </SVGContainer>
  );
};

export default CorrectMark;

const SVGContainer = styled.div`
  width: 14rem;
  height: 16rem;

  svg {
    width: 100%;
    height: 100%;
    transform: rotate(140deg);
  }

  ellipse {
    fill: none;
    stroke: red;
    stroke-width: 4;
    stroke-dasharray: 283;
    stroke-dashoffset: 283;
    animation: drawEllipse 2s ease-in-out forwards;
  }

  @keyframes drawEllipse {
    100% {
      stroke-dashoffset: 0;
    }
  }
`;
