/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

export default function NextPage() {
  const auth = getAuth();
  const navigate = useNavigate();
  const db = getFirestore();

  const [bettingHistory, setBettingHistory] = useState([]);
  const [selectedBettingHistory, setSelectedBettingHistory] = useState(null); // 選択されたベッティング履歴
  const [loading, setLoading] = useState(true);

  // Firestore からユーザーのベッティング履歴を取得
  useEffect(() => {
    const fetchBettingHistory = async () => {
      const userRef = doc(db, "users", auth.currentUser.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const bettingHistory = userData.bettingHistory || [];
        setBettingHistory(bettingHistory);
      }
      setLoading(false);
    };

    fetchBettingHistory();
  }, [db, auth]);

  // 選択したベッティング履歴の詳細を表示
  const handleBettingHistoryClick = (bettingDocId) => {
    const selectedHistory = bettingHistory.find(bet => bet.bettingDocId === bettingDocId);
    setSelectedBettingHistory(selectedHistory);
  };

  // 戻るボタン
  const handleBack = () => {
    setSelectedBettingHistory(null);
  };

  // ローディング中の表示
  if (loading) {
    return <div>Loading...</div>;
  }

  // 履歴が存在しない場合
  if (bettingHistory.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        You have no betting history yet.
      </div>
    );
  }

  // 詳細情報が表示されている場合
  if (selectedBettingHistory) {
    return (
      <div className="bg-gray-100 p-6">
        <button
          onClick={handleBack}
          className="mb-4 p-2 bg-blue-500 text-white rounded-md"
        >
          Back to Betting History
        </button>

        <h2 className="text-2xl font-bold mb-4">Betting History - {selectedBettingHistory.bettingDocId}</h2>
        
        {/* ベッティング履歴の詳細情報 */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex justify-between mb-2">
            <span className="font-semibold">Bet Amount:</span>
            <span>{selectedBettingHistory.betAmount} </span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="font-semibold">Total Odds:</span>
            <span>{selectedBettingHistory.totalOdds.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="font-semibold">Predicted Earnings:</span>
            <span>{selectedBettingHistory.predictedAmount.toFixed(2)} </span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="font-semibold">Result:</span>
            <span>{selectedBettingHistory.result}</span>
          </div>

          {/* 試合ごとのベット結果を表示 */}
          <h3 className="mt-4 text-xl font-semibold">Bet Details:</h3>
          {selectedBettingHistory.bets.map((bet, index) => (
            <div key={index} className="bg-gray-50 p-3 mb-2 rounded-md shadow-sm">
              <div className="flex justify-between">
                <span className="font-semibold">{bet.homeTeam} vs {bet.awayTeam}</span>
                <span>{bet.homeScore} : {bet.awayScore}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span>{bet.oddsChoice}</span>
                <span>{bet.oddsValue} Odds</span>
              </div>
              <div className="mt-2">
                <span className={`font-semibold ${bet.result === '的中' ? 'text-green-500' : 'text-red-500'}`}>{bet.result}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ベッティング履歴のリスト
  return (
    <div className="bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">Your Betting History</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bettingHistory.map((betting) => (
          <div
            key={betting.bettingDocId}
            className="bg-white p-4 rounded-lg shadow-md cursor-pointer"
            onClick={() => handleBettingHistoryClick(betting.bettingDocId)}
          >
            <h2 className="text-xl font-semibold">{betting.bettingDocId}</h2>
            <div className="mt-2">
              <span className="font-medium">Bet Amount: </span>
              <span>{betting.betAmount} </span>
            </div>
            <div className="mt-2">
              <span className="font-medium">Result: </span>
              <span className={betting.result === 'won' ? 'text-green-500' : 'text-red-500'}>
                {betting.result === 'won' ? 'Won' : 'Lost'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
