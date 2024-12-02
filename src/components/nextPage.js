import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";

// eslint-disable-next-line no-unused-vars
export default function NextPage(data, data2) {
  const auth = getAuth();
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();
  const db = getFirestore();

  const [bettingHistory, setBettingHistory] = useState([]);
  const [selectedBettingHistory, setSelectedBettingHistory] = useState(null); // 選択されたベッティング履歴
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);  // 残高

  // Firestore からユーザーのベッティング履歴を取得
  useEffect(() => {
    const fetchBettingHistory = async () => {
      const userRef = doc(db, "users", auth.currentUser.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const bettingHistory = userData.bettingHistory || [];
        setBalance(userData.balance || 0);  // 残高を取得してセット
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

  const handleBetResult = async () => {
    if (!selectedBettingHistory) {
      return; // selectedBettingHistoryがない場合、何もしない
    }

    const { bettingDocId, betAmount } = selectedBettingHistory;
  
    let allBetsWon = true;
    let status2 = true;
  
    // data.eventsが存在することを確認
    if (!data || !data.data || !data.data.events || !Array.isArray(data.data.events)) {
      console.error("data.data.events is undefined or not an array");
      return;
    }
  
    // 各試合の結果をチェック
    for (const bet of selectedBettingHistory.bets) {
      const eventId = bet.eventId; // その試合のeventId
      const selectedChoice = bet.oddsChoice; // その試合で選ばれた選択肢（win, draw, defeat）
  
      // bet.choiceType に基づいて selectedChoiceIndex を決定
      const selectedChoiceIndex = {
        win: 0,
        draw: 1,
        defeat: 2
      }[selectedChoice]; // ここで 'win' -> 0, 'draw' -> 1, 'defeat' -> 2 を設定
  
      // 試合の情報を取得
      const event = data.data.events.find(e => e.id === parseInt(eventId));  // eventIdを基に該当試合を検索
      const event2 = data.data2.odds[eventId];

      let result = "開始前";
   

      // if (event2?.choices?.[selectedChoiceIndex]?.winning !== undefined) {
      //   // 試合が開始しており、結果がわかる場合
      //   result = event2.choices[selectedChoiceIndex].winning ? '的中' : '外れ';
      //   status2 = false;
      // }

      if (event2?.choices?.[selectedChoiceIndex]?.winning === undefined) {
        // 試合が開始しており、結果がわかる場合
       
        status2 = false;
      }
      else {
        result = event2.choices[selectedChoiceIndex].winning ? '的中' : '外れ';
      }

      
      if (event) {
        const homeScore = event?.homeScore?.current ?? '-';  // スコアが無ければ0を設定
        const awayScore = event?.awayScore?.current ?? '-';  // スコアが無ければ0を設定
  
       
  
        // 試合の結果を更新
        selectedBettingHistory.bets = selectedBettingHistory.bets.map(betItem => {
          if (betItem.eventId === eventId) {
            if (event2?.choices?.[selectedChoiceIndex]?.winning !== true) {
              allBetsWon = false;
            } 

            return {
              ...betItem,
              homeScore,  // 最新スコアを数値として更新
              awayScore,  // 最新スコアを数値として更新
            //  result: event2?.choices?.[selectedChoiceIndex]?.winning ? '的中' : '外れ', // 結果として的中・外れを設定
              result : result,
            };
          }
          return betItem;
        });
      }
    }
  
    // 勝利した場合、予測金額を計算
    let predictedAmount = 0;
    // if (allBetsWon) {
    //   predictedAmount = betAmount * selectedBettingHistory.totalOdds; // betAmount と totalOdds を掛けて予測金額を計算
    // }
    predictedAmount = betAmount * selectedBettingHistory.totalOdds;

  
  
    // Firestoreのユーザーデータを更新
    const userRef = doc(db, "users", auth.currentUser.uid);
  
  
    // FirestoreのbettingHistoryを取得
    const userBettingHistoryRef = doc(db, "users", auth.currentUser.uid);
    const userDoc = await getDoc(userBettingHistoryRef);
  
    if (userDoc.exists()) {
      // 既存のベット情報がある場合、bettingHistoryを更新
      const existingBettingHistory = userDoc.data().bettingHistory || [];
  
    
      // 該当するbettingDocIdの履歴を見つけて更新
      const updatedBettingHistory = existingBettingHistory.map(bet => {
        if (bet.bettingDocId === bettingDocId) {
          // 該当する履歴があった場合、その履歴を上書き 
        
          if (allBetsWon && bet.chargeStatus) {
            const finalBalance = balance + predictedAmount; // 予想金額を加算
            
            setBalance(finalBalance); // UI上の残高を更新
        
            // Firestoreの残高更新
            updateDoc(userRef, { balance: finalBalance });
        
            alert('All bets won! Your balance has been updated.');

            return {
              ...bet,
              bets: selectedBettingHistory.bets, // 更新されたbets情報を上書き
              allBetsWon, // すべてのベットが当たったかどうか
              
              chargeStatus: false,
              result: '的中', // 結果として全て勝ったか負けたか
              
              predictedAmount, // Firestoreに保存する予測金額
            };
         
          } else {
            // もしベットに負けた場合、そのまま新しい残高を設定
        
        
            alert('One or more bets lost. Your balance has been updated.');
          }

          return {
            ...bet,
            bets: selectedBettingHistory.bets, // 更新されたbets情報を上書き
            allBetsWon, // すべてのベットが当たったかどうか
            result: allBetsWon ? '的中' : (status2 ? '外れ' : '開始前'), 
            
            predictedAmount, // Firestoreに保存する予測金額
          };
        }
        return bet; // 該当しない場合はそのまま
      });
  
      // bettingHistoryを上書き更新
      await updateDoc(userBettingHistoryRef, {
        bettingHistory: updatedBettingHistory,
      });
    }
  
    // すべてのベットが的中した場合
    // if (allBetsWon) {
    //   const finalBalance = balance + predictedAmount; // 予想金額を加算
    //   setBalance(finalBalance); // UI上の残高を更新
  
    //   // Firestoreの残高更新
    //   await updateDoc(userRef, { balance: finalBalance });
  
    //   alert('All bets won! Your balance has been updated.');
    // } else {
    //   // もしベットに負けた場合、そのまま新しい残高を設定
  
  
    //   alert('One or more bets lost. Your balance has been updated.');
    // }
    console.log(data);  // デバッグ用にdataを出力
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

          {/* 試合ごとのベット結果 */}
          <h3 className="text-xl font-semibold">Bet Details:</h3>
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
                <span className={`font-semibold ${bet.result === '的中' ? 'text-green-500' : bet.result === '外れ' ? 'text-red-500' : 'text-gray-500'}`}>
                  Result: {bet.result}
                </span>
              </div>
            </div>
          ))}

          {/* ベット結果処理 */}
          <div className="mt-4">
            <button
              onClick={handleBetResult}
              className="p-2 bg-green-500 text-white rounded-md"
            >
              Process Bet Results
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ベッティング履歴のリスト表示
  return (
    <div className="bg-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-4">Your Betting History</h2>
      {bettingHistory.map((betting, index) => (
        <div
          key={index}
          className="bg-white p-4 rounded-lg shadow-md mb-4 cursor-pointer"
          onClick={() => handleBettingHistoryClick(betting.bettingDocId)}
        >
          <div className="flex justify-between">
            <span className="font-semibold">Betting Document ID:</span>
            <span>{betting.bettingDocId}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Total Bets:</span>
            <span>{betting.bets.length} Matches</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Bet Amount:</span>
            <span>{betting.betAmount}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Predicted Earnings:</span>
            <span>{betting.predictedAmount.toFixed(2)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}