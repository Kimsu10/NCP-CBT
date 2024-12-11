import styled from "styled-components";
import React, { useEffect, useRef, useState } from "react";
import { nanoid } from "nanoid";
// toss 모듈 임포트 연동 방식 (npm으로 SDK 설치)
import { loadPaymentWidget } from "@tosspayments/payment-widget-sdk";

const Sponsor = ({ username }) => {
  const paymentWidgetRef = useRef(null);
  const [price, setPrice] = useState([0]);
  const [customerKey, setCustomerKey] = useState("");
  const [isAgreed, setIsAgreed] = useState(false);
  const amounts = [100, 500, 1000];
  const canRenderWidget = price && isAgreed;
  // 테스트용키
  const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
  //  const clientKey = process.env.REACT_APP_TOSS_CLIENT_KEY;

  // 고객키 서버에서 생성후 받아오기 - UUID
  useEffect(() => {
    const fetchCustomerKey = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/sponsor/create-customer-key",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        const data = await response.json();
        setCustomerKey(data.customerKey);
      } catch (error) {
        console.error("고객 키 생성 실패:", error);
      }
    };

    fetchCustomerKey();
  }, []);

  console.log("클라이언트 키 :", clientKey);
  console.log("고객 키 :", customerKey);

  // 1. 클라이언트 키로 SDK 초기화 & 결제 위젯 인스턴스 생성
  useEffect(() => {
    if (canRenderWidget) {
      (async () => {
        try {
          // 토스 페이먼츠 초기화 (clientKey 필수 · string, customerKey UUID 형식이여야함, 비회원은 ANONYMOUS 값으로 사용)
          const paymentWidget = await loadPaymentWidget(clientKey, customerKey);
          // DOM이 생성된 이후에 renderPaymentMethods() 메서드로 결제 UI를 렌더링
          // 여러 결제 UI를 만들었다면, variantKey를 결제위젯 어드민에서 확인하고 파라미터로 넘기세요. -> 나는 국내 일반결제 하나니까 안해도 될듯
          paymentWidget.renderPaymentMethods("#payment-widget", price);
          paymentWidget.renderAgreement();
          paymentWidgetRef.current = paymentWidget;
        } catch (err) {
          console.error("결제 위젯 초기화 실패:", err);
        }
      })();
    }
  }, [canRenderWidget]);

  // 토스로 결제 요청
  // 결제 요청 전에 orderId와 amount를 서버에 임시 저장해서 결제 무결성을 확인해야함
  // 결제 버튼에 결제 요청 메서드 requestPayment()를 이벤트로 걸어주기
  // 결제 성공시 succssURL로 이동 실패시 failURL로 이동
  const handlePayment = async () => {
    const paymentWidget = paymentWidgetRef.current;

    try {
      if (paymentWidget) {
        await paymentWidget.requestPayment({
          orderId: nanoid(),
          orderName: `${price}원`,
          customerName: `${username}` || "익명",
          customerEmail: ``,
          successUrl: `${process.env.REACT_APP_BASE_URL}/success`,
          failUrl: `${process.env.REACT_APP_BASE_URL}/fail`,
        });
      } else {
        console.error("결제 위젯이 초기화되지 않았습니다.");
      }
    } catch (err) {
      console.error("결제 요청 실패:", err);
    }
  };

  return (
    <SponsorBody>
      <div className="tosspay-container">
        <h1 className="sponsor-title">후원하기</h1>
        {amounts.map(amount => (
          <PriceButtons
            key={amount}
            onClick={() => setPrice(amount)}
            id="payment-button"
          >
            {amount}원
          </PriceButtons>
        ))}
        <p className="selected-price">후원 금액: {price} &nbsp;원</p>
        <div id="agreement">
          <label>
            <input
              type="checkbox"
              className="agree-checkbox"
              checked={isAgreed}
              onChange={e => setIsAgreed(e.target.checked)}
            />
            정말 사주시는 건가요?🤤
          </label>
        </div>
      </div>
      {canRenderWidget && <PaymentWidgetContainer id="payment-widget" />}
      {canRenderWidget && (
        <button onClick={handlePayment} className="sponsor-button">
          후원하기
        </button>
      )}
    </SponsorBody>
  );
};

export default Sponsor;

const SponsorBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 32rem;
  width: 100vw;
  height: 96vh;
  padding: 10rem 0;

  .sponsor-title {
    text-align: center;
    margin-bottom: 2rem;
  }

  .selected-price {
    margin: 2rem;
    text-align: center;
    font-size: 1.3rem;
    font-weight: 700;
  }

  #agreement,
  #payment-method {
    margin: 1rem;
  }

  #agreement label {
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  #agreement input[type="checkbox"] {
    margin: 0;
  }
`;

const PaymentWidgetContainer = styled.div`
  width: 100%;
  min-width: 32rem;
  max-width: 36rem;
  height: 32rem;
  border-radius: 8px;
  margin: 0 auto;

  #payment-widget {
    margin: 2rem 0;
  }
`;

const PriceButtons = styled.button`
  margin: 0 0.6rem;
  background-color: #2272eb;
`;
