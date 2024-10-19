import styled from "styled-components";

const Footer = () => {
  return <FooterBody>푸터 영역</FooterBody>;
};
export default Footer;

const FooterBody = styled.div`
  width: 100%;
  height: 8vh;
  padding: 1rem;
  background-color: lightgray;
  text-align: center;
  z-index: 10;
`;
