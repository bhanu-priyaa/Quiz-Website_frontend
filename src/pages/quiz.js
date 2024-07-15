import React, { useEffect, useState } from 'react';
import QuestionPage from './questionPage';
import './quiz.css';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Quiz = () => {
  const { page } = useParams();
  const navigate = useNavigate();
  const [number, setNumber] = useState(1);
  const { authState } = useAuth(); // Access the auth state
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([]);
  const [responses, setResponses] = useState({});
  const [markedQuestions, setMarkedQuestions] = useState({});
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds

  const fetchQuestion = async (num) => {
    const config = {
      method: 'get',
      url: `http://localhost:5000/evaluation/question/${Number(num) + Number(page)}`,
      headers: {
        'Origin': 'http://localhost:3000',
        'Content-Type': 'application/json',
        'x-access-token': authState.accessToken
      }
    };
    await axios.request(config).then((response) => {
      const data = response.data;
      if (!data.error) {
        setQuestion(data.data.question);
        setOptions(data.data.options);
      } else {
        navigate('/')
      }
    });
  };

  useEffect(() => {
    fetchQuestion(number);
  }, [number]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prevTimeLeft) => {
        if (prevTimeLeft <= 1) {
          clearInterval(interval);
          document.querySelector('.end-test').click();
          return 0;
        }
        return prevTimeLeft - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);


  const handleAnswerClick = (answer) => {
    setResponses((prevResponses) => ({
      ...prevResponses,
      [number]: answer,
    }));
  };

  const handleMarkForReview = () => {
    const selectedAnswer = responses[number];
    const selectedOptionText = options.find(option => option === selectedAnswer);
    console.log(`Question ${number}: Selected option - ${selectedAnswer}: ${selectedOptionText}`);

    let configSave = {
      method: 'post',
      url: 'http://localhost:5000/evaluation/save',
      headers: {
        'Origin': 'http://localhost:3000',
        'x-access-token': authState.accessToken
      },
      data: {
        questionNumber: Number(number) + Number(page),
        response: selectedOptionText
      }
    }
    axios.request(configSave)
    .then((response) => {
      const data = response.data;
      console.log(data)
      setMarkedQuestions((prevMarkedQuestions) => ({
        ...prevMarkedQuestions,
        [number]: !prevMarkedQuestions[number],
      }));
    })
  };

  const handleClearResponse = () => {
    setResponses((prevResponses) => ({
      ...prevResponses,
      [number]: null,
    }));
  };

  const handleNextQuestion = () => {
    setNumber((prevNumber) => prevNumber + 1);
  };

  const handleQuestionClick = (num) => {
    setNumber(num);
  };

  const handleEndTest = () => {
    console.log("the valu of page is: ", page)
    navigate(`/result/${Number(page)/20}`);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="quiz-container">
      <header className="quiz-header">
        <h1>Test 1</h1>
        <div className="timer">
          {formatTime(timeLeft)}
          <button>Pause</button>
        </div>
      </header>
      <main className="quiz-content">
        <div className="question-section">
          <QuestionPage
            number={number}
            question={question}
            options={options}
            selectedAnswer={responses[number]}
            onAnswerClick={handleAnswerClick}
          />
          <div className="response-actions">
            <button onClick={handleClearResponse}>Clear Response</button>
            <button onClick={handleMarkForReview} disabled={markedQuestions[number]}>
              {markedQuestions[number] ? 'Already Saved' : 'Save Response'}
            </button>
            <button onClick={handleNextQuestion}>Next</button>
          </div>
        </div>
        <aside className="question-palette">
          <h4>Question Palette</h4>
          <div className="question-numbers">
            {[...Array(20).keys()].map((num) => (
              <button
                key={num}
                className={`question-number ${num + 1 === number ? 'current' : ''}`}
                onClick={() => handleQuestionClick(num + 1)}
              >
                {num + 1}
              </button>
            ))}
          </div>
          <button className="end-test" onClick={handleEndTest}>End Test</button>
        </aside>
      </main>
    </div>
  );
};

export default Quiz;
