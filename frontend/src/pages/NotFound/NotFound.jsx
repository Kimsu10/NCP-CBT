import styled from "styled-components";

const NotFound = () => {
  return (
    <WhoAreYou>
      <h1>...?</h1>
      <img src="/images/who.jpg" alt="who" />
      <h1>회원이 아니시군요</h1>
    </WhoAreYou>
  );
};

export default NotFound;

const WhoAreYou = styled.div`
  width: 100%;
  height: 100%;
  padding: 4rem 0 1rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;

  .who-image {
    width: 100%;
    height: auto;
  }

  h1 {
    margin: 2rem;
  }
`;
