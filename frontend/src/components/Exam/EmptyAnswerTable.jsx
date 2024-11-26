import React from "react";
import styled from "styled-components";

const EmptyAnswerTable = props => {
  const data = props.selectedAnswers;

  // null 값의 인덱스를 유지하면서 null인 항목만 추출
  const emptyAnswers = data.reduce((acc, item, index) => {
    if (item === null) {
      acc.push({ index: index + 1, value: null });
    }
    return acc;
  }, []);

  // 15행씩 분할
  const columns = [];
  for (let i = 0; i < emptyAnswers.length; i += 15) {
    columns.push(emptyAnswers.slice(i, i + 15));
  }

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
      {columns.map((column, columnIndex) => (
        <ColumnContainer key={columnIndex}>
          <TableContainer>
            <thead>
              <tr>
                <th>문제</th>
                <th>답</th>
              </tr>
            </thead>
            <tbody>
              {column.map(item => (
                <tr key={item.index}>
                  <td
                    onClick={() => handleRowClick(item.index - 1)}
                    className="clickRow"
                  >
                    {item.index}
                  </td>
                  <td>{getCircledNumber(item.value)}</td>
                </tr>
              ))}
            </tbody>
          </TableContainer>
        </ColumnContainer>
      ))}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  width: 100%;
`;

const ColumnContainer = styled.div`
  flex: 1;
  width: 100%;
`;

const TableContainer = styled.table`
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

export default EmptyAnswerTable;
