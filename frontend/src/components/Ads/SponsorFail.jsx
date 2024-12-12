import React, { useEffect, useState } from "react";

const SponsorFail = () => {
  const [errorDetails, setErrorDetails] = useState({
    code: "",
    message: "",
    orderId: "",
  });

  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const errorCode = urlParams.get("code") || "알 수 없음";
      const errorMessage = urlParams.get("message") || "일반 오류";
      const orderId = urlParams.get("orderId") || "없음";

      setErrorDetails({
        code: errorCode,
        message: errorMessage,
        orderId: orderId,
      });

      alert(
        `결제 실패\n오류 코드: ${errorCode}\n오류 메시지: ${errorMessage}\n주문 ID: ${orderId}`,
      );

      const redirectTimer = setTimeout(() => {
        window.location.href = "/";
      }, 3000);

      return () => clearTimeout(redirectTimer);
    } catch (error) {
      console.error("Error processing payment failure:", error);
      window.location.href = "/";
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-red-600 mb-4">결제 실패</h2>
        <div className="mb-2">
          <strong>오류 코드:</strong> {errorDetails.code}
        </div>
        <div className="mb-2">
          <strong>오류 메시지:</strong> {errorDetails.message}
        </div>
        <div className="mb-4">
          <strong>주문 ID:</strong> {errorDetails.orderId}
        </div>
        <p className="text-gray-600">3초 후 메인 페이지로 이동합니다</p>
      </div>
    </div>
  );
};

export default SponsorFail;
