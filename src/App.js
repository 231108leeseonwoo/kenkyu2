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
// eslint-disable-next-line no-unused-vars
import Table from "./components/table";
// eslint-disable-next-line no-unused-vars
import Table2 from "./components/table2";  // テーブルコンポーネント

// eslint-disable-next-line no-unused-vars
import Table4 from "./components/table4";
// eslint-disable-next-line no-unused-vars
import { fetchFixtures } from "./lib/fetch-data";  // データ取得用の関数
// eslint-disable-next-line no-unused-vars
import { fetchFixtures2 } from "./lib/fetch-data2";  // データ取得用の関数
import { fetchFixtures3 } from "./lib/fetch-data3";  // データ取得用の関数



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



  const [fixtures2, setFixtures2] = useState([]);

  const fetchData2 = async () => {
    const result = await fetchFixtures2();
    setFixtures2(result);
  };

  useEffect(() => {
    fetchData2();
  }, []);

  console.log(fixtures2);



  const [fixtures3, setFixtures3] = useState([]);

  const fetchData3 = async () => {
    const result = await fetchFixtures3();
    setFixtures3(result);
  };

  useEffect(() => {
    fetchData3();
  }, []);

  console.log(fixtures3);



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
            <Route path="/" element={<Table data={fixtures} />} />
            
            <Route path="/signIn" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} /> {/* /signup で SignUp コンポーネントを表示 */}
            
            <Route path="/events/:customId" element={<Fixture data={fixtures} />} />


            <Route path="/odds" element={<Table2 data={fixtures2} />} />

            
            <Route path="/match" element={<Table4 data={fixtures3} />} />
            
            
          </Routes>
        )}

        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;