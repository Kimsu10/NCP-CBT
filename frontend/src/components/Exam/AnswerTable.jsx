import styled from "styled-components";

const AnswerTable = props => {
  const data = props.selectedAnswers;

  const firstRow = data.slice(0, 15);
  const secondRow = data.slice(15, 30);
  const thirdRow = data.slice(30, 45);
  const fourthRow = data.slice(45, 60);

  // 문제 선택 핸들러
  const handleRowClick = id => {
    props.setCurrentIndex(id);
  };

  // 숫자를 원형 숫자로 변환하는 함수
  const getCircledNumber = num => {
    const numbers = ["①", "②", "③", "④"];
    return numbers[num - 1] || num;
  };

  return (
    <Container>
      <FirstItem>
        <TableConatiner>
          <thead>
            <tr>
              <th>문제</th>
              <th>답</th>
            </tr>
          </thead>
          <tbody>
            {firstRow.map((item, index) => {
              return (
                <tr key={index}>
                  <td
                    onClick={() => handleRowClick(index)}
                    className="clickRow"
                  >
                    {index + 1}
                  </td>
                  <td>{getCircledNumber(item)}</td>
                </tr>
              );
            })}
          </tbody>
        </TableConatiner>
      </FirstItem>
      <SecondItem>
        <TableConatiner>
          <thead>
            <tr>
              <th>문제</th>
              <th>답</th>
            </tr>
          </thead>
          <tbody>
            {secondRow.map((item, index) => {
              return (
                <tr key={index}>
                  <td
                    onClick={() => handleRowClick(index + 15)}
                    className="clickRow"
                  >
                    {index + 16}
                  </td>
                  <td>{getCircledNumber(item)}</td>
                </tr>
              );
            })}
          </tbody>
        </TableConatiner>
      </SecondItem>
      <ThirdItem>
        <TableConatiner>
          <thead>
            <tr>
              <th>문제</th>
              <th>답</th>
            </tr>
          </thead>
          <tbody>
            {thirdRow.map((item, index) => {
              return (
                <tr key={index}>
                  <td
                    onClick={() => handleRowClick(index + 30)}
                    className="clickRow"
                  >
                    {index + 31}
                  </td>
                  <td>{getCircledNumber(item)}</td>
                </tr>
              );
            })}
          </tbody>
        </TableConatiner>
      </ThirdItem>
      <FourthItem>
        <TableConatiner>
          <thead>
            <tr>
              <th>문제</th>
              <th>답</th>
            </tr>
          </thead>
          <tbody>
            {fourthRow.map((item, index) => {
              return (
                <tr key={index}>
                  <td
                    onClick={() => handleRowClick(index + 45)}
                    className="clickRow"
                  >
                    {index + 46}
                  </td>
                  <td>{getCircledNumber(item)}</td>
                </tr>
              );
            })}
          </tbody>
        </TableConatiner>
      </FourthItem>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const FirstItem = styled.div``;

const SecondItem = styled.div``;

const ThirdItem = styled.div``;

const FourthItem = styled.div``;

const TableConatiner = styled.table`
  border-collapse: separate;
  border-spacing: 0;
  text-align: center;
  width: 100%;

  th,
  td {
    padding: 6px 15px;
  }

  th {
    background: #42444e;
    color: #fff;
    text-align: left;
  }
  tr:first-child th:first-child {
    border-top-left-radius: 6px;
  }
  tr:first-child th:last-child {
    border-top-right-radius: 6px;
  }
  td {
    border-right: 1px solid #c6c9cc;
    border-bottom: 1px solid #c6c9cc;
  }
  td:first-child {
    border-left: 1px solid #c6c9cc;
  }
  tr:nth-child(even) td {
    background: #eaeaed;
  }
  tr:last-child td:first-child {
    border-bottom-left-radius: 6px;
  }
  tr:last-child td:last-child {
    border-bottom-right-radius: 6px;
  }

  .clickRow {
    cursor: pointer;
  }
`;

export default AnswerTable;
