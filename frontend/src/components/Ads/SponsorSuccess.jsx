import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const SponsorSuccess = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const verifyPayment = async () => {
      const paymentType = searchParams.get("paymentType");
      const orderId = searchParams.get("orderId");
      const paymentKey = searchParams.get("paymentKey");
      const amount = searchParams.get("amount");

      // 결제 정보를서버로 보내고 서버에서 toss로 결제 승인 API를 호출하는데 Bad Request가 뜬단말이지..

      if (orderId && paymentKey && amount) {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BASE_URL}/sponsor/verify-payment`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                paymentType, // 공식문서에서는 없음
                orderId,
                paymentKey,
                amount,
              }),
            },
          );

          if (!response.ok) {
            throw new Error("결제 검증 실패");
          }

          const data = await response.json();
          console.log("결제 검증 성공:", data);
        } catch (err) {
          console.error("결제 검증 에러:", err);
        }
      }
    };

    verifyPayment();
  }, [searchParams]);

  return (
    <div>
      <h1>결제 성공</h1>
    </div>
  );
};

export default SponsorSuccess;
