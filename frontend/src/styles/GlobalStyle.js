import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  ul,li {
    list-style: none;
  }

  a {
    text-decoration: none;
  }

  button {
    border: none;
    border-radius: 0.5em;
    cursor: pointer;
    color: white;
    background-color: ${props => props.theme.mainColor};

    &:hover {
    background-color: #0073cf;
    color:white
  }
  }

  input {
    background-color: transparent;
    outline: none;
    font-size: 1em;
    vertical-align: middle;
  }

  img{
    display:block;
    border:0;
  }

  .slick-slide {
    display: flex !important;
    justify-content: center;
    border-bottom-left-radius: 0.5em;
    border-bottom-right-radius: 0.5em;
    background-color: white;

  }
`;

export default GlobalStyle;
