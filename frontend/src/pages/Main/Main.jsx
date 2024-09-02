import axios from "axios";
import { useEffect } from "react";

const Main = () => {
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
    </>
  );
};
export default Main;
