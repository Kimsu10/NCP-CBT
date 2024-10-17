import { useNavigate } from "react-router-dom";

const Main = () => {
  const navigate = useNavigate();

  // 연습문제 페이지 이동 주소 -> 주석아래있는 코드는 나중에 홍씨가 지우면 됩니다.
  const handleMovePractice = name => {
    navigate(`/${name}/practice`);
  };

  return (
    <>
      <div>메인페이지</div>
      {/* 임시 버튼 -> 연습문제로 이동  ncp는 ncp 메인에서 ncp200,ncp202 이런식으로 나눠져야함*/}
      <button className="nca" onClick={() => handleMovePractice("nca")}>
        NCA
      </button>
      <button className="ncp" onClick={() => handleMovePractice("ncp")}>
        NCP
      </button>
      <button className="nce" onClick={() => handleMovePractice("nce")}>
        NCE
      </button>
    </>
  );
};
export default Main;
