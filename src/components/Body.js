import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import questions from './questions.json';
import "../styles/style.css"

const Body = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showNextButton, setShowNextButton] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [shuffledAnswers, setShuffledAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  useEffect(() => {
    const answers = [
      ...currentQuestion.incorrect_answers,
      currentQuestion.correct_answer,
    ];
    answers.sort(() => Math.random() - 0.5);
    setShuffledAnswers(answers);
  }, [currentQuestion]);

  const handleAnswerClick = (answer) => {
    setSelectedAnswer(answer);
    if (answer === currentQuestion.correct_answer) {
      setIsCorrect(true);
      setScore(score + 1);
    } else {
      setIsCorrect(false);
    }
    setShowNextButton(true);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex === totalQuestions - 1) {
      setQuizCompleted(true);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowNextButton(false);
      setIsCorrect(false);
    }
  };

  const finishQuiz = () => {
    setQuizCompleted(true);
  };

  const renderDifficultyStars = (difficulty) => {
    const starIcons = [];
    let starCount = 0;
    const diff = ["easy","medium","hard"];
    for(let a = 0; a<3;a++){
      if(difficulty === diff[a]){
        starCount = a+1;
      }
    }

    for (let i = 1; i <= 3; i++) {
      starIcons.push(
        <FontAwesomeIcon
          icon={faStar}
          key={i}
          className={i <= starCount ? "filled-star" : "fade-star"}
        />
      );
    }

    return <div className="difficulty-stars">{starIcons}</div>;
  };

  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  return (
    <div>
      <div className="progress-bar">
        <div className="progress" style={{ width: `${progress}%` }}></div>
      </div>
      {currentQuestionIndex < totalQuestions && !quizCompleted ? (
        <div className="container">
          <h2>Question {currentQuestionIndex + 1} of {totalQuestions}:</h2>
          {renderDifficultyStars(currentQuestion.difficulty)}
          <p>{decodeURIComponent(currentQuestion.question)}</p>

          <div className="cta_wrapper">
            {shuffledAnswers.map((answer, index) => (
              <button
                className={`cta ${selectedAnswer === answer ? (isCorrect ? 'correct' : 'incorrect') : ''}`}
                key={index}
                onClick={() => handleAnswerClick(answer)}
                disabled={showNextButton}
              >
                {decodeURIComponent(answer)}
              </button>
            ))}
          </div>

          {selectedAnswer && (
            <p className="error">
              {isCorrect
                ? "Correct"
                : `Sorry, the correct answer is: ${decodeURIComponent(currentQuestion.correct_answer)}`}
            </p>
          )}

          {showNextButton ? (
            currentQuestionIndex === totalQuestions - 1 ? (
              <button onClick={finishQuiz} className="cta">Finish</button>
            ) : (
              <button onClick={nextQuestion} className="cta">Next Question</button>
            )
          ) : null}
        </div>
      ) : (
        <div className="final_score">
        <p>Quiz completed! <br/> Your final score is: {score} / {totalQuestions}</p>
        </div>
      )}
    </div>
  );
};

export default Body;
