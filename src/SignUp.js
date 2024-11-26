import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase-config";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom'; // useNavigateをインポート
import './SignUp.css';

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");  // ニックネームの追加
  const [error, setError] = useState("");
  
  const navigate = useNavigate(); // useNavigate フックを使用して遷移を制御

  // Firestoreインスタンスの取得
  const db = getFirestore();

  // サインアップ処理
  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      // Firebase Authenticationでユーザー作成
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user; // 作成したユーザーの情報

      // Firestoreにユーザー情報を保存
      await setDoc(doc(db, "users", user.uid), {
        nickname: nickname,  // ユーザーが入力したニックネーム
        email: email,        // ユーザーのメールアドレス
        balance: 120,          // 初期残高は0
        bettingHistory: [],  // 初期ベッティング履歴は空の配列
        rank: "bronze",      // 初期ランク（仮にbronzeとする）
      });

      // フォームをリセット
      setEmail("");
      setPassword("");
      setNickname("");
      setError("");

      // サインアップ後に / に遷移
      alert("Account created successfully!");
      navigate('/');  // ホーム画面やメインページに遷移
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2 className="signup-title">Sign Up</h2>
        <form onSubmit={handleSignUp} className="signup-form">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="signup-input"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="signup-input"
            required
          />
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Nickname"
            className="signup-input"
            required
          />
          <button type="submit" className="signup-button">Sign Up</button>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default SignUp;
