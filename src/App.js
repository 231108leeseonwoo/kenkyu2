import React, { useEffect, useState } from "react";
import './App.css';
import NarBar from "./components/narbar";  // ナビゲーションバーのコンポーネント
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Fixture from "./components/fixture";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Footer from "./components/footer";
// eslint-disable-next-line no-unused-vars
import SignUp from "./SignUp";
import SignIn from "./SignIn";
import Table from "./components/table";  // テーブルコンポーネント
import { fetchFixtures } from "./lib/fetch-data";  // データ取得用の関数

function App() {
  const [fixtures, setFixtures] = useState([]);

  const fetchData = async () => {
    const result = await fetchFixtures();
    setFixtures(result);
  };

  useEffect(() => {
    fetchData();
  }, []);

  console.log(fixtures);

  const refresh = () => window.location.reload(true);

  return (
    <div className="w-full md:w-[700px] lg:w-[800px] m-auto">
      <BrowserRouter>
        <NarBar />

        <button onClick={refresh} className="btn bg-black text-white btn-sm fixed bottom-3 right-2 z-40">
          refresh
        </button>

        {fixtures.length === 0 ? (
          <div className="h-screen bg-white w-full text-center p-10">
            <Box>
              <CircularProgress />
            </Box>
          </div>
        ) : (
          <Routes>
            {/* ログイン、サインアップ、試合詳細などのルート定義 */}

            <Route path="/signIn" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} /> {/* /signup で SignUp コンポーネントを表示 */}
            <Route path="/" element={<Table data={fixtures} />} />
            <Route path="/fixture/:matchID" element={<Fixture data={fixtures} />} />
          </Routes>
        )}

        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;