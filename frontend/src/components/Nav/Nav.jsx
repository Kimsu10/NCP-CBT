import styled from "styled-components";

const Nav = () => {
  return (
    <NavBody>
      <NavLogo />
      <ControllerBox>
        <Login>로그인</Login>
        <Register>회원가입</Register>
      </ControllerBox>
    </NavBody>
  );
};

export default Nav;

const NavBody = styled.div`
  width: 100vw;
  height: 4rem;
  background-color: ${props => props.theme.mainColor};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
`;

const NavLogo = styled.img`
  width: 3rem;
  height: 3rem;
`;

const ControllerBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${props => props.theme.white};
  gap: 1rem;
`;

const Login = styled.div``;

const Register = styled.div``;
