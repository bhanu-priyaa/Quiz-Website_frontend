import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from './AuthContext';
import '../pages/login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAuth(); // Access the login function from context
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async() => {
    console.log('asfsgs')
    let config = {
      method: 'post',
      url: 'http://localhost:5000/auth/login',
      headers: {
        'Origin': 'http://localhost:3000',
        'Content-Type': 'application/json'
      },
      data: {
        userName: userName,
        password: password
      }
    }

    axios.request(config)
    .then((response) => {
      const data = response.data;
      console.log(data.error)
      if(!data.error) {
        login(data.data.accessToken); // Save the token using the context
        navigate('/home')
      }
    }).catch((error) => {
      console.log('error occured in login')
    })
}

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Login</h2>
        <p style={{ color: "#969BAC" }} className="loginLable">Please enter your login details </p>
        <div>
          <div className="input-group">
            <label htmlFor="username">Email ID<span className="required">*</span></label>
            <input type="text" id="username" name="username" placeholder="Enter Email" required value={userName} onChange={(e) => setUserName(e.target.value)} />
          </div>
          <div className="input-group">
            <label htmlFor="password">Enter Password<span className="required">*</span></label>
            <div className="password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="toggle-password" onClick={togglePasswordVisibility}>
                <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
              </span>
            </div>
          </div>
          <button onClick={handleLogin}>Login</button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
