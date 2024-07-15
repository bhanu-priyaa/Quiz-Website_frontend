import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './resultpage.css';
import { useParams } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ResultPage = ({ userId }) => {
  const [results, setResults] = useState([]);
  const [score, setScore] = useState(0);
  const [summary, setSummary] = useState({
    attempted: 0,
    unattempted: 0,
    correct: 0,
    incorrect: 0,
  });
  const { authState } = useAuth(); // Access the auth state
  const { page } = useParams();

  console.log(Number(page))

  const routePage = Number(page) === 1 ? 1 : Number(page)+1;

  useEffect(() => {
    const fetchResults = async () => {
      const config = {
        method: 'get',
        url: `http://localhost:5000/evaluation/evaluate/${routePage}`,
        headers: {
          'Origin': 'http://localhost:3000',
          'Content-Type': 'application/json',
          'x-access-token': authState.accessToken
        }
      };
      await axios.request(config).then((response) => {
        const data = response.data;
        if (!data.error) {
          setResults(data.data.result);
          setScore(data.data.score);
          setSummary(data.data.summary);
        }
      });
    };

    fetchResults();
  }, [userId]);

  return (
    <div className="result-container">
      <header className="result-header">
        <h1>Quiz Results</h1>
      </header>
      <main className="result-content">
        <div className="summary-card">
          <h2>Summary</h2>
          <p>Score: {score}</p>
          {console.log(summary)}
          <p>Attempted: {summary.attempted}</p>
          <p>Unattempted: {summary.unattempted}</p>
          <p>Correct: {summary.correct}</p>
          <p>Incorrect: {summary.incorrect}</p>
        </div>
        <div className="question-summary">
          <h2>Question Summary</h2>
          <ul className="result-list">
            {results.map((result, index) => (
              <li key={index} className={`result-item ${result.correct ? 'correct' : 'incorrect'}`}>
                <div className="question-number">Question {index + 1}</div>
                <div className="question-text">{result.question}</div>
                <div className="answer-text">Your answer: {result.answer}</div>
                <div className="correctness">{result.correct ? 'Correct' : 'Incorrect'}</div>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default ResultPage;
