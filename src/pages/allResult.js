import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './resultpage.css';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const AllPages = ({ userId }) => {
    const navigate = useNavigate();
    const [results, setResults] = useState([]);

    const { authState } = useAuth(); // Access the auth state

    useEffect(() => {
        if (!authState.accessToken) {
          navigate('/');
          return;
        }
    
        const fetchResults = async () => {
          const config = {
            method: 'get',
            url: `http://localhost:3000/evaluation/fetchAll`,
            headers: {
              'Origin': 'http://localhost:3000',
              'Content-Type': 'application/json',
              'x-access-token': authState.accessToken
            }
          };
          await axios.request(config).then((response) => {
            const data = response.data;
            if (!data.error) {
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
    
    export default AllPages;    