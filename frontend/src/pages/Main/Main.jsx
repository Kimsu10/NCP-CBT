import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Main = () => {
  const navigate = useNavigate();

  const handleMovePractice = name => {
    navigate(`/${name}/practice`);
  };

  useEffect(() => {
    const corsTest = () => {
      axios
        .get("http://localhost:8080")
        .then(res => console.log(res))
        .catch(err => console.log(err));
    };
    corsTest();
  }, []);

  return (
    <>
      <div>메인페이지</div>
      {/* 임시 버튼 -> 연습문제로 이동 */}
      <button className="nca" onClick={() => handleMovePractice("NCA")}>
        NCA
      </button>
      <button className="ncp" onClick={() => handleMovePractice("NCP")}>
        NCP
      </button>
      <button className="nce" onClick={() => handleMovePractice("NCE")}>
        NCE
      </button>
    </>
  );
};
export default Main;
