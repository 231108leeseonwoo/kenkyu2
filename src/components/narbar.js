import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase-config"; // Firebase auth をインポート
import { signOut } from "firebase/auth"; // Firebase の signOut 関数をインポート
import { doc, getDoc } from "firebase/firestore"; // Firestoreからデータを取得するためにインポート
import { db } from './../firebase-config'; // Firestoreのインスタンスをインポート

export default function NavBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null); // ユーザー情報を保持する状態
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setIsLoggedIn(true);
        // ユーザーがログインした場合、Firestoreからそのユーザーの情報を取得
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserInfo(userDoc.data()); // ユーザーの情報を状態にセット
        }
      } else {
        setIsLoggedIn(false);
        setUserInfo(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth); // FirebaseのsignOut関数でログアウト
      setIsLoggedIn(false);
      navigate("/"); // ログアウト後、ログインページに遷移
    } catch (error) {
      console.error("Logout error: ", error);
    }
  };

  return (
    <div className="navbar bg-base-100 sticky top-0" data-theme="dark">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li tabIndex={0}><Link to="/nextPage">bettingHistory</Link></li>
            <li tabIndex={0}><Link to="/results">Profile</Link></li>
            <li><Link to="/odds" className="justify-between">Odds</Link></li>
          </ul>
        </div>
        <a href="/" className="btn btn-ghost normal-case text-xl">LiveScores</a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li tabIndex={0}><Link to="/nextPage">bettingHistory</Link></li>
          <li tabIndex={0}><Link to="/results">Profile</Link></li>
          <li><Link to="/odds" className="justify-between">Odds</Link></li>
        </ul>
      </div>
      <div className="navbar-end">
        {isLoggedIn ? (
          <>
            <div className="user-info">
              {/* ユーザーがログインしている場合に表示 */}
              {userInfo && (
                <div>
                  <p key="nickname">{userInfo.nickname}</p>
                  <p key="rank">{userInfo.rank}</p>
                  <p key="balance">{userInfo.balance.toFixed(2)} </p>
                </div>
              )}
            </div>
            <button onClick={handleLogout} className="btn">LOGOUT</button>
          </>
        ) : (
          <Link to="/signin" className="btn">LOGIN</Link>
        )}
      </div>
    </div>
  );
}
