import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import HomePage from './pages/homepage';
import Quiz from './pages/quiz';
import ResultPage from './pages/resultpage';
import AllResultPage from './pages/allResult';
import { AuthProvider } from './pages/AuthContext';


const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/quiz/:page" element={<Quiz/>} />
          <Route path='/result/:page' element={<ResultPage/>}/>
          <Route path='/all' element={<AllResultPage/>}/>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
