import { useEffect, useState } from "react";
import axiosConfig from "../../utils/axiosConfig";
import styled from "styled-components";

const Admin = () => {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    getAllComplaints();
  }, []);

  const getAllComplaints = async () => {
    const response = await axiosConfig
      .get(`/admin/complaints`)
      .catch(err => {});

    if (response.status === 200) {
      setComplaints(response.data);
    }

    if (response.status === 500) {
      console.log("서버 에러", response.data);
    }
  };

  const handleSolvedComplaints = async (userId, id) => {
    const response = await axiosConfig
      .post(`/admin/solvedComplaints`, { userId: userId, id: id })
      .catch(err => {
        console.log(err);
      });

    if (response.status === 200) {
      alert("사용자에게 메일이 전송되었습니다.");
      window.location.reload();
    }

    if (response.status === 500) {
      console.log("서버 에러", response.data);
    }
  };

  return (
    <MainContainer>
      <ComplaintsContainer>
        {complaints.map((item, index) => {
          return (
            <div key={index} className="item-list">
              <div>유저 아이디 : {item.userId}</div>
              <div>과목코드 : {item.subjectId}</div>
              <div>문제코드 : {item.subjectQuestionId}</div>
              <div>제목 : {item.title}</div>
              <div>내용 : {item.content}</div>
              <button
                onClick={() => handleSolvedComplaints(item.userId, item.id)}
              >
                문제가 해결되었다면 이 버튼을 눌러 사용자에게 알림을 보냅시다.
              </button>
            </div>
          );
        })}
      </ComplaintsContainer>
    </MainContainer>
  );
};

const MainContainer = styled.div`
  margin-top: 6rem;

  .item-list {
    border: 1px solid gray;
    margin: 1rem 0;
  }

  button {
    min-width: 50%;
  }
`;

const ComplaintsContainer = styled.div``;

export default Admin;
