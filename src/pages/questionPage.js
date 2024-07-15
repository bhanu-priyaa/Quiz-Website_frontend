import React from 'react';

const QuestionPage = ({ number, question, options, selectedAnswer, onAnswerClick }) => {
  return (
    <div>
      <h2>Question {number}</h2>
      <p>{question}</p>
      <ul className="answer-list">
        {options.map((option, index) => (
          <li
            key={index}
            className={`answer-item ${selectedAnswer === option ? 'selected' : ''}`}
            onClick={() => onAnswerClick(option)}
          >
            {option}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuestionPage;
