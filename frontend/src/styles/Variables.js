import { css } from "styled-components";

export const flexRowBox = (
  direction = "row",
  justify = "center",
  align = "center",
) => `
  display: flex;
  flex-direction: ${direction};
  justify-content: ${justify};
  align-items: ${align};
`;

export const absoluteCenter = css`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export const fullSize = css`
  width: 100%;
  height: 100%;

  .content-wrapper {
    display: flex;
    flex-direction: column;
    min-height: 90vh;
  }

  footer {
    margin-top: auto;
  }
`;
