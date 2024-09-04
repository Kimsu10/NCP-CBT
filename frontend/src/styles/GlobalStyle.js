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
    border-radius: 0.5rem;
    padding: 0.5rem;
    font-weight: 700;
    cursor: pointer;
    color: white;
    background-color: ${props => props.theme.mainColor};

    &:hover {
    background-color: ${props => props.theme.subColor};
    color:white;
    }  
  }

  input {
    background-color: transparent;
    outline: none;
    font-size: 1rem;
    vertical-align: middle;
    border-radius: 0.5rem;
    border: 1px solid #d9d9d9;
  }

  img{
    display:block;
    border:0;
  }

  .modal-title{
    margin-bottom: 2rem;
  }

`;

export default GlobalStyle;
