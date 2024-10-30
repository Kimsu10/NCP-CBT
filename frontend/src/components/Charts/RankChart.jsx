import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import styled from "styled-components";
import useResponsive from "../../hooks/useResponsive";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

// export const data = {
//   labels,
//   datasets: [
//     {
//       data: labels.map(() => Math.random() * 59),
//       backgroundColor: "#00D25A",
//     },
//   ],
// };

const RankChart = ({ rowData, chartTitle }) => {
  const emoji = ["🥇", "🥈", "🥉", "🏅", "🎖️"];

  const options = {
    indexAxis: "y",
    elements: {
      bar: {
        borderWidth: 2,
        borderRadius: 50,
      },
    },
    responsive: true,
    scales: {
      x: {
        max: 60,
      },
    },
    plugins: {
      title: {
        display: true,
        text: chartTitle,
        font: {
          size: 20,
        },
      },
      tooltip: {
        enable: false,
        intersect: true,
        displayColors: false,
      },
    },
  };

  const chartData = {
    labels:
      rowData?.map(
        (item, index) =>
          `${item.nickname || "이름없는개발자~（　´∀｀）"} ${emoji[index]}`,
      ) || "NCBT",
    datasets: [
      {
        data: rowData?.map(item => item.score) || 0,
        backgroundColor: function (context) {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          if (!chartArea) {
            // 차트 영역이 없으면 기본 색상 반환
            return "#00D25A";
          }

          // 가로 방향 그라데이션 생성
          const gradient = ctx.createLinearGradient(
            chartArea.left,
            0,
            chartArea.right,
            0,
          );

          gradient.addColorStop(0, "#00D25A");
          gradient.addColorStop(1, "#00C3C8");

          return gradient;
        },
      },
    ],
  };

  // 반응형
  const { windowWidth, isMobile, isTablet, isDesktop, getDeviceType } =
    useResponsive();

  return (
    <>
      {isMobile && (
        <MobileBox>
          <Bar options={options} data={chartData} />
        </MobileBox>
      )}
      {isTablet && (
        <ChartBox>
          <Bar options={options} data={chartData} />
        </ChartBox>
      )}
      {isDesktop && (
        <ChartBox>
          <Bar options={options} data={chartData} />
        </ChartBox>
      )}
    </>
  );
};

export default RankChart;

const MobileBox = styled.div`
  background-color: #f7f7f7;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 6rem 0;
`;

const ChartBox = styled.div`
  background-color: #f7f7f7;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 6rem 0;
  max-height: 20rem;
  max-width: 80rem;
`;
