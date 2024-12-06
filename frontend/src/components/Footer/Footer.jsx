import { Link } from "react-router-dom";
import styled from "styled-components";

const Footer = () => {
  return (
    <FooterBody>
      <div className="introduce-box">
        <p className="introduce-text">
          이 사이트는 네이버 클라우드 공식 웹사이트와 관련이 없습니다.
          <br />
          네이버 클라우드 시험 접수 및 문의는 &nbsp;
          <Link to="https://edu.ncloud.com/certi">
            <span className="go-to-navercloud">네이버 클라우드 공식페이지</span>
          </Link>
          에서 가능합니다.
        </p>
        <span className="send-inquiry">개발자에게 문의하기</span>
      </div>
      <div className="button-box">
        <button className="sponsor-button">☕️&nbsp;후원하기</button>
        <button className="mini-sponsor-button">☕️</button>
      </div>
    </FooterBody>
  );
};
export default Footer;

const FooterBody = styled.div`
  width: 100%;
  min-width: 28rem;
  height: auto;
  padding: 1rem;
  background-color: #f3f4f8;
  text-align: center;
  z-index: 10;
  padding: 2.4rem;
  display: flex;
  justify-content: space-between;
  /* position: absolute; */
  bottom: 0;

  .introduce-box {
    text-align: start;
    color: gray;

    .introduce-text {
      margin-bottom: 1rem;

      .go-to-navercloud {
        cursor: pointer;
        font-weight: 600;
        color: gray;

        &:hover {
          text-decoration: underline;
        }
      }
    }

    .send-inquiry {
      cursor: pointer;
      font-weight: 600;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .button-box {
    position: relative;

    .sponsor-button {
      width: 10rem;
      height: 3.4rem;
      background-color: black;
      font-size: 1.1rem;
      display: block;
    }

    .mini-sponsor-button {
      line-height: 0.8;
      background-color: black;
      border-radius: 50%;
      width: 3rem;
      height: 3rem;
      font-size: 1.2rem;
      position: absolute;
      top: -120%;
      right: 0;
      display: none;
    }
  }

  @media (max-width: 780px) {
    .button-box {
      .sponsor-button {
        display: none;
      }

      .mini-sponsor-button {
        display: block;
      }
    }
  }
`;
