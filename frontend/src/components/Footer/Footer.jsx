import styled from "styled-components";

const Footer = () => {
  return <FooterBody>푸터 영역</FooterBody>;
};
export default Footer;

const FooterBody = styled.div`
  /* position: fixed;
  bottom: 0; */
  width: 100%;
  padding: 1rem;
  background-color: lightgray;
  text-align: center;
  z-index: 10;
`;
