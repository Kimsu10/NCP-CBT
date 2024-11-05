import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ExamWait from "../../components/Wait/ExamWait";

const Exam = () => {
  const param = useParams();
  const subjectName = param.name;
  const navigate = useNavigate();
  const [isExamStart, setIsExamStart] = useState(false);

  // 로그인하지 않은 사용자는 NotFound 페이지로 보내고, 로그인한 사용자에게는 ExamWait 컴포넌트를 띄움.
  const token = sessionStorage.getItem("accessToken");

  useEffect(() => {
    if (!token) {
      navigate(`/${subjectName}/who-are-you`);
    }
  }, [token]);

  // ExamWait 컴포넌트에서 시험 시작 버튼을 누르면 시험이 시작된다.
  const handleStart = () => {
    setIsExamStart(true);
  };

  return (
    <>
      {!isExamStart ? <ExamWait onStart={handleStart} /> : <div>시험이다~</div>}
    </>
  );
};

export default Exam;
