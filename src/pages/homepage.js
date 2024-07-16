import React, { useEffect, useState } from 'react';
import './homepage.css';
import { FaBook, FaBrain } from 'react-icons/fa';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Homepage = () => {
  const { authState } = useAuth();
  const [tests, setTests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authState.accessToken) {
      navigate('/');
      return;
    }

    const fetchTests = async () => {
      try {
        const config = {
          method: 'get',
          url: 'http://localhost:3000/quiz/fetch', // Replace with your API endpoint
          headers: {
            'Origin': 'http://localhost:3000',
            'Content-Type': 'application/json',
            'x-access-token': authState.accessToken,
          },
        };

        const response = await axios.request(config);
        setTests(response.data.data);
      } catch (error) {
        console.error('Error fetching tests:', error);
      }
    };

    fetchTests();
  }, [authState.accessToken, navigate]);

  return (
    <div className="homepage">
      <h1 className="title">Explore Our Exciting Quizzes</h1>
      <p className="subtitle">Challenge your knowledge and skills with our wide range of quizzes</p>
      <div className="card-container">
        {tests.map(test => (
          <div className="card" key={test.id}>
            <div className="card-icon">
              {test.title.includes('Current Affairs') ? <FaBook /> : <FaBrain />}
            </div>
            <h2 className="card-title">{test.title}</h2>
            <p className="card-grade" style={{ color: '#b2a6a6' }}>{test.grade}</p>
            {test.result ? (
              test.score !== undefined ? (
                <p className="card-score">Score: {test.score}</p>
              ) : (
                <a href={`/quiz/${test.question}`} target="_blank" rel="noopener noreferrer">
                  <button className="card-button">Take Test</button>
                </a>
              )
            ) : (
              <a href={`/quiz/${test.question}`} target="_blank" rel="noopener noreferrer">
                <button className="card-button">Take Test</button>
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Homepage;
