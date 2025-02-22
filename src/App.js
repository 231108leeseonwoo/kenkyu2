// import React, { useEffect, useState } from "react";
// import './App.css';
// import NarBar from "./components/narbar";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Fixture from "./components/fixture";
// import CircularProgress from '@mui/material/CircularProgress';
// import Box from '@mui/material/Box';
// import Footer from "./components/footer";
// import SignUp from "./SignUp";
// import SignIn from "./SignIn";
// import Table from "./components/table";
// import Table2 from "./components/table2";
// import Table4 from "./components/table4";
// import { fetchFixtures } from "./lib/fetch-data";
// import { fetchFixtures2 } from "./lib/fetch-data2";
// import { fetchFixtures3 } from "./lib/fetch-data3";

// function App() {
//   const [fixtures, setFixtures] = useState([]);
//   const [fixtures2, setFixtures2] = useState([]);
//   const [fixtures3, setFixtures3] = useState([]);

//   const fetchData = async () => {
//     const result1 = await fetchFixtures();
//     setFixtures(result1);

//     const result2 = await fetchFixtures2();
//     setFixtures2(result2);

//     const result3 = await fetchFixtures3();
//     setFixtures3(result3);
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const refresh = () => window.location.reload(true);

//   // データがすべて取得されたか確認
//   if (fixtures.length === 0 || fixtures2.length === 0 || fixtures3.length === 0) {
//     return (
//       <div className="h-screen bg-white w-full text-center p-10">
//         <Box>
//           <CircularProgress />
//         </Box>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full md:w-[700px] lg:w-[800px] m-auto">
//       <BrowserRouter>
//         <NarBar />
//         <button onClick={refresh} className="btn bg-black text-white btn-sm fixed bottom-3 right-2 z-40">
//           refresh
//         </button>

//         <Routes>
//           <Route path="/" element={<Table data={fixtures} />} />
//           <Route path="/signIn" element={<SignIn />} />
//           <Route path="/signup" element={<SignUp />} />
//           <Route path="/events/:customId" element={<Fixture data={fixtures} />} />
//           <Route path="/odds" element={<Table2 data={fixtures2} />} />
//           <Route path="/match" element={<Table4 data={fixtures3} data2={fixtures2} />} />
//         </Routes>

//         <Footer />
//       </BrowserRouter>
//     </div>
//   );
// }

// export default App;




















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
import ResultsPage from "./ResultsPage"; 
import NextPage from "./components/nextPage";



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
            <Route path="/results" element={<ResultsPage />} /> {/* ResultsPageルートを追加 */}
            <Route path="/nextPage" element={<NextPage data={fixtures3} data2={fixtures2}/>} />

            <Route path="/events/:customId" element={<Fixture data={fixtures} />} />


            <Route path="/odds" element={<Table2 data={fixtures2} />} />

            
            <Route path="/match" element={<Table4 data={fixtures3} data2={fixtures2} />} />

            
            
          </Routes>
        )}

        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;