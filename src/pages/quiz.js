import React, { useEffect, useState, useCallback } from 'react';
import QuestionPage from './questionPage';
import './quiz.css';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Quiz = () => {
  const { page } = useParams();
  const navigate = useNavigate();
  const { authState } = useAuth();
  const [number, setNumber] = useState(1);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([]);
  const [responses, setResponses] = useState(() => {
    const savedResponses = localStorage.getItem('responses');
    return savedResponses ? JSON.parse(savedResponses) : {};
  });
  const [markedQuestions, setMarkedQuestions] = useState(() => {
    const savedMarkedQuestions = localStorage.getItem('markedQuestions');
    return savedMarkedQuestions ? JSON.parse(savedMarkedQuestions) : {};
  });
  const [attemptedNotSaved, setAttemptedNotSaved] = useState(() => {
    const savedAttemptedNotSaved = localStorage.getItem('attemptedNotSaved');
    return savedAttemptedNotSaved ? JSON.parse(savedAttemptedNotSaved) : {};
  });
  const [timeLeft, setTimeLeft] = useState(() => {
    const savedTime = localStorage.getItem('timeLeft');
    return savedTime ? Number(savedTime) : 3600;
  });
  const [tabChangeCount, setTabChangeCount] = useState(0);

  const fetchQuestion = useCallback(async (num) => {
    const config = {
      method: 'get',
      url: `http://localhost:3000/evaluation/question/${Number(num) + Number(page)}`,
      headers: {
        'Origin': 'http://localhost:3000',
        'Content-Type': 'application/json',
        'x-access-token': authState.accessToken,
      },
    };

    try {
      const response = await axios.request(config);
      const data = response.data;
      if (!data.error) {
        setQuestion(data.data.question);
        setOptions(data.data.options);
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Error fetching question:', error);
      navigate('/');
    }
  }, [authState.accessToken, navigate, page]);

  useEffect(() => {
    if (!authState.accessToken) {
      navigate('/');
      return;
    }
    
    fetchQuestion(number);
  }, [fetchQuestion, number]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prevTimeLeft) => {
        if (prevTimeLeft <= 1) {
          clearInterval(interval);
          document.querySelector('.end-test').click();
          return 0;
        }
        const newTimeLeft = prevTimeLeft - 1;
        localStorage.setItem('timeLeft', newTimeLeft);
        return newTimeLeft;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        setTabChangeCount((prevCount) => prevCount + 1);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (tabChangeCount >= 3) {
      axios.post('http://localhost:3000/evaluation/end-test', {
        message: 'User has switched tabs too many times.',
      });
      navigate(`/result/${Math.floor(Number(page) / 20)}`);
    }
  }, [tabChangeCount, navigate, page]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('responses', JSON.stringify(responses));
    localStorage.setItem('markedQuestions', JSON.stringify(markedQuestions));
    localStorage.setItem('attemptedNotSaved', JSON.stringify(attemptedNotSaved));
  }, [responses, markedQuestions, attemptedNotSaved]);

  const handleAnswerClick = (answer) => {
    setResponses((prevResponses) => ({
      ...prevResponses,
      [number]: answer,
    }));
    setAttemptedNotSaved((prevAttemptedNotSaved) => ({
      ...prevAttemptedNotSaved,
      [number]: true,
    }));
  };

  const handleMarkForReview = useCallback(() => {
    const selectedAnswer = responses[number];
    const selectedOptionText = options.find((option) => option === selectedAnswer);

    let configSave = {
      method: 'post',
      url: 'http://localhost:3000/evaluation/save',
      headers: {
        'Origin': 'http://localhost:3000',
        'x-access-token': authState.accessToken,
      },
      data: {
        questionNumber: Number(number) + Number(page),
        response: selectedOptionText,
      },
    };

    axios.request(configSave).then(() => {
      setMarkedQuestions((prevMarkedQuestions) => ({
        ...prevMarkedQuestions,
        [number]: true,
      }));
      setAttemptedNotSaved((prevAttemptedNotSaved) => {
        const newAttemptedNotSaved = { ...prevAttemptedNotSaved };
        delete newAttemptedNotSaved[number];
        return newAttemptedNotSaved;
      });
    });
  }, [authState.accessToken, number, options, page, responses]);

  const handleClearResponse = () => {
    setResponses((prevResponses) => ({
      ...prevResponses,
      [number]: null,
    }));
    setAttemptedNotSaved((prevAttemptedNotSaved) => {
      const newAttemptedNotSaved = { ...prevAttemptedNotSaved };
      delete newAttemptedNotSaved[number];
      return newAttemptedNotSaved;
    });
  };

  const handleNextQuestion = () => {
    setNumber((prevNumber) => prevNumber + 1);
  };

  const handleQuestionClick = (num) => {
    setNumber(num);
  };

  const handleEndTest = () => {
    navigate(`/result/${Math.floor(Number(page) / 20)}`);
  };


  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const disableContextMenu = (e) => {
      e.preventDefault();
    };
    window.addEventListener('contextmenu', disableContextMenu);

    return () => {
      window.removeEventListener('contextmenu', disableContextMenu);
    };
  }, []);

  return (
    <div className="quiz-container">
      <header className="quiz-header">
        <h1>Test 1</h1>
        <div className="timer">
          {formatTime(timeLeft)}
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
            <button
              onClick={handleMarkForReview}
              disabled={markedQuestions[number] || !responses[number]}
              className={!responses[number] ? 'disabled' : ''}
            >
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
                className={`question-number ${num + 1 === number ? 'current' : ''} ${markedQuestions[num + 1] ? 'marked' : ''} ${responses[num + 1] ? 'attempted' : ''} ${attemptedNotSaved[num + 1] ? 'attempted-not-saved' : ''}`}
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
