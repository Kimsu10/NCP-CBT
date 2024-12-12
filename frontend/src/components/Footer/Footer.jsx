import { Link, useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isSponsorPage = location.pathname.startsWith("/sponsor");

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
        <a
          href="mailto:neta@gmail.com"
          className="send-inquiry"
          style={{ color: "gray" }}
        >
          개발자에게 문의하기
        </a>
      </div>
      <div className="button-box">
        {!isSponsorPage && (
          <>
            <button
              className="sponsor-button"
              // onClick={() => navigate("/sponsor")}
              onClick={() => alert("현재 테스트 단계입니다.")}
            >
              ☕️&nbsp;후원하기
            </button>
            <button
              className="mini-sponsor-button"
              onClick={() => navigate("/sponsor")}
            >
              ☕️
            </button>
          </>
        )}
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
      top: -7rem;
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
