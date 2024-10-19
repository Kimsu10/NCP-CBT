import { useEffect } from "react";

const KeyboardController = ({
  handleOptionChange,
  selectedOptions,
  isChecked,
  currentIdx,
  currentQuestion,
  handleNextQuestion,
  handlePreviousQuestion,
  handleCheckAnswer,
  handleRetry,
  handleBookmark,
  isComplaintModal,
}) => {
  useEffect(() => {
    const handleKeyDown = e => {
      if (isChecked && ["1", "2", "3", "4"].includes(e.key)) {
        return;
      }

      if (isComplaintModal) {
        return;
      }

      switch (e.key) {
        case "1":
          handleOptionChange(1);
          break;
        case "2":
          handleOptionChange(2);
          break;
        case "3":
          handleOptionChange(3);
          break;
        case "4":
          handleOptionChange(4);
          break;
        case "Enter":
        case "ArrowUp":
          if (selectedOptions.length > 0) {
            handleCheckAnswer();
          }
          break;
        case "ArrowRight":
          handleNextQuestion();
          break;
        case "ArrowLeft":
          handlePreviousQuestion();
          break;
        case "ArrowDown":
        case "r":
        case "ㄱ":
          handleRetry();
          break;
        case "b":
        case "ㅠ":
          handleBookmark();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    selectedOptions,
    isChecked,
    currentIdx,
    currentQuestion,
    handleOptionChange,
    handleNextQuestion,
    handlePreviousQuestion,
    handleCheckAnswer,
    handleRetry,
    handleBookmark,
  ]);

  return null;
};

export default KeyboardController;
