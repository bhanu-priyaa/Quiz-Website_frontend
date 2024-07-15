import React from 'react';
import './homepage.css';
import { FaBook, FaBrain } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Homepage = () => {
  const tests = [
    { id: 1, title: 'General Knowledge', icon: <FaBrain />, grade: 'Grade 7th', question: 1 },
    { id: 2, title: 'General Knowledge', icon: <FaBrain />, grade: 'Grade 8th', question: 20  },
    { id: 3, title: 'General Knowledge', icon: <FaBrain />, grade: 'Grade 9th', question: 40  },
    { id: 4, title: 'General Knowledge', icon: <FaBrain />, grade: 'Grade 10th', question: 60  },
    { id: 5, title: 'Current Affairs', icon: <FaBook />, grade: 'Grade 7th', question: 80  },
    { id: 6, title: 'Current Affairs', icon: <FaBook />, grade: 'Grade 8th', question: 100  },
    { id: 7, title: 'Current Affairs', icon: <FaBook />, grade: 'Grade 9th', question: 120  },
    { id: 8, title: 'Current Affairs', icon: <FaBook />, grade: 'Grade 10th', question: 140 },
  ];

  return (
    <div className="homepage">
      <h1 className="title">Explore Our Exciting Quizzes</h1>
      <p className="subtitle">Challenge your knowledge and skills with our wide range of quizzes</p>
      <div className="card-container">
        {tests.map(test => (
          <div className="card" key={test.id}>
            <div className="card-icon">{test.icon}</div>
            <h2 className="card-title">{test.title}</h2>
            <p className="card-grade" style={{ color: '#b2a6a6' }}>{test.grade}</p>
            <a href={`/quiz/${test.question}`} target="_blank">
              <button className="card-button">Take Test</button>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Homepage;
