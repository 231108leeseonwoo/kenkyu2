import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Link と useNavigate をインポート
import { auth } from "./../firebase-config"; // Firebase auth をインポート
import { signOut } from "firebase/auth"; // Firebase の signOut 関数をインポート

export default function NavBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // ログイン状態を追跡する状態
  const navigate = useNavigate();

  // Firebase の認証状態が変わった時に呼ばれる useEffect
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true); // ユーザーがログインしている場合
      } else {
        setIsLoggedIn(false); // ユーザーがログアウトしている場合
      }
    });

    // クリーンアップ関数
    return () => unsubscribe();
  }, []);

  // ログアウト処理
  const handleLogout = async () => {
    try {
      await signOut(auth); // Firebase の signOut 関数でログアウト
      setIsLoggedIn(false); // ログアウト状態を反映
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
            <li>
              <a>Fixtures</a>
            </li>
            <li tabIndex={0}>
              <a className="justify-between">Results</a>
            </li>
            <li>
              <Link to="/odds" className="justify-between">Odds</Link> {/* Oddsリンクに変更 */}
            </li>
          </ul>
        </div>
        <a href="/" className="btn btn-ghost normal-case text-xl">
          LiveScores
        </a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <a>Fixtures</a>
          </li>
          <li tabIndex={0}>
            <a>Results</a>
          </li>
          <li>
            <Link to="/odds" className="justify-between">Odds</Link> {/* Oddsリンクに変更 */}
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        {/* ログインしている場合はログアウトボタン、していない場合はログインボタンを表示 */}
        {isLoggedIn ? (
          <button onClick={handleLogout} className="btn">
            LOGOUT
          </button>
        ) : (
          <Link to="/signin" className="btn">
            LOGIN
          </Link>
        )}
      </div>
    </div>
  );
}
