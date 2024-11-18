//test2
// eslint-disable-next-line no-unused-vars
import React , {useEffect, useState} from "react";
import './App.css';
import NarBar from "./components/narbar";
// eslint-disable-next-line no-unused-vars
import { fetchFixtures } from "./lib/fetch-data";
// eslint-disable-next-line no-unused-vars
import { data } from "./lib/dummy-data";
import Table from "./components/table";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Fixture from "./components/fixture";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Footer from "./components/footer";
import SignUp from "./SignUp";
import SignIn from "./SignIn";


function App() {

  // eslint-disable-next-line no-unused-vars
  const [fixtures , setFixtures] = useState([]);

  const fetchData = async () => {
    const result = await fetchFixtures();
    setFixtures(result);
  };

  useEffect(() => {
    fetchData();
  },[]);

  console.log(fixtures);

  const refresh = () => window.location.reload(true);

  return (
 
    <div className="w-full md:w-[700px] lg:w-[800px] m-auto">
      <NarBar/>

      <button onClick={refresh} className="btn bg-black text-white btn-sm fixed bottom-3 right-2 z-40">
        refresh
      </button>

      {fixtures.length == 0 ? (
        <div className="h-screen bg-white w-full text-center p-10">
            <Box>
              <CircularProgress />
            </Box> 

        </div>
      ):(

     
      <BrowserRouter>

        <Routes>

        <Route path="/" element={<SignUp />}></Route>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/fixture" element={<Table data={fixtures} />}></Route>
          <Route path="/fixture" element={<Table data={fixtures} />}></Route>
          <Route path="/fixture/:matchID" element={<Fixture data={fixtures} />}></Route>
          

        </Routes>

      </BrowserRouter>
      )}

      <Footer />
      
    </div>
  )

}

export default App;