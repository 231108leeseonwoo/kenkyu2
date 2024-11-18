import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase-config";
import { useNavigate } from 'react-router-dom'; // useNavigateをインポート
import './SignIn.css'; // CSSファイルをインポート

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const navigate = useNavigate(); // useNavigateフックを使用してページ遷移を制御

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail("");
      setPassword("");
      setError("");
      alert("Login successful!");

      // ログイン成功後に /fixture に遷移
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  // 会員登録ページに遷移するための関数
  const navigateToSignUp = () => {
    navigate('/signup'); // /signup に遷移
  };

  return (
    <div className="signin-container">
      <div className="signin-card">
        <h2 className="signin-title">Sign In</h2>
        <form onSubmit={handleSignIn} className="signin-form">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="signin-input"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="signin-input"
            required
          />
          <button type="submit" className="signin-button">Sign In</button>
        </form>
        {error && <p className="error-message">{error}</p>}

        {/* 会員登録ボタン */}
        <button onClick={navigateToSignUp} className="signup-button">
          Create an Account
        </button>
      </div>
    </div>
  );
};

export default SignIn;
