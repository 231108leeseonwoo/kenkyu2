/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'; // 画面遷移用
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Firebase Authenticationをインポート
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore"; // Firestoreからデータを取得 // Firestoreからデータを取得

export default function Table4({ data, data2 }) {
  // Firebase Authentication
  const auth = getAuth();
  const navigate = useNavigate(); // React Routerのnavigateフック

  // Firestoreのインスタンス
  const db = getFirestore();

  // ステート管理
  // eslint-disable-next-line no-unused-vars
  const [currentTime, setCurrentTime] = useState(Date.now() / 1000); // 現在のUNIXタイムスタンプ（秒）
  const [selectedOdds, setSelectedOdds] = useState({}); // 選択したオッズのオブジェクト形式で保持
  const [totalOdds, setTotalOdds] = useState(1); // 予想配当率
  const [betAmount, setBetAmount] = useState(""); // ユーザーが入力した金額（空文字で初期化）
  const [predictedAmount, setPredictedAmount] = useState(0); // 予想金額
  const [balance, setBalance] = useState(0); // 初期残高は0
  const [errorMessage, setErrorMessage] = useState(""); // エラーメッセージの状態管理
  const [isLoggedIn, setIsLoggedIn] = useState(false); // ログイン状態を管理

  // useEffectで毎秒タイムスタンプを更新
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now() / 1000);
    }, 1000);  // 1秒ごとに更新

    // Firebase Authenticationのログイン状態を監視
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);  // ユーザーがログインしている場合
        // ログインした場合、Firestoreからユーザー情報を取得してbalanceをセット
        const userRef = doc(db, "users", user.uid); // ユーザーのドキュメント参照
        getDoc(userRef).then((docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setBalance(userData.balance || 0); // balanceがなければ0を設定
          } else {
            console.log("No such user document!");
          }
        });
      } else {
        setIsLoggedIn(false); // ユーザーがログインしていない場合
        setBalance(0); // ログアウト時は残高をリセット
      }
    });

    return () => {
      clearInterval(interval); // コンポーネントがアンマウントされた時にインターバルをクリア
      unsubscribe(); // Authenticationの監視を解除
    };
  }, [auth, db]);

  // `data` や `data.events` が存在するか確認し、データが存在しない場合は "Loading..." を表示
  if ((!data || !Array.isArray(data.events) || data.events.length === 0) || (!data2 || !data2.odds)) {
    return <div>Loading...</div>;  // データがまだロードされていない場合、または空の場合
  }

  // fractionalオッズを倍数に変換する関数
  const convertFractionalToDecimal = (fractionalValue) => {
    const [numerator, denominator] = fractionalValue.split('/').map(Number);
    return (numerator / denominator) + 1;  // 例: "83/100" -> 1.83
  };

  // オッズをクリックした時の処理（選択を1つだけに制限、また選択解除機能）
  const handleOddsClick = (eventId, choiceType, oddsValue) => {
    setSelectedOdds((prevSelectedOdds) => {
      const newSelectedOdds = { ...prevSelectedOdds };

      // もしそのオッズがすでに選ばれていれば、選択解除
      if (newSelectedOdds[eventId]?.choiceType === choiceType) {
        delete newSelectedOdds[eventId];  // 解除するために削除
      } else {
        // 新しい選択肢を追加
        newSelectedOdds[eventId] = { choiceType, oddsValue };
      }

      // 予想配当率を計算
      const newTotalOdds = Object.values(newSelectedOdds).reduce((total, { oddsValue }) => total * oddsValue, 1);
      setTotalOdds(newTotalOdds);  // 配当率を更新

      // 予想金額の更新
      const newPredictedAmount = betAmount * newTotalOdds;
      setPredictedAmount(newPredictedAmount);

      return newSelectedOdds;
    });
  };

  // 金額入力時の処理
  const handleBetAmountChange = (e) => {
    const amount = parseFloat(e.target.value) || ""; // 入力が無効な場合は空文字
    setBetAmount(amount);

    // 金額が変更された際に予想金額を更新
    const newPredictedAmount = amount * totalOdds;
    setPredictedAmount(newPredictedAmount);

    // 残高チェック
    if (amount > balance) {
      setErrorMessage("Your bet amount exceeds your available balance.");
    } else {
      setErrorMessage(""); // エラーメッセージをクリア
    }
  };

    // ベットがすべて的中したか確認し、的中した場合に残高を更新する関数
const handleBetResult = async () => {
  let allBetsWon = true; // すべてのベットが当たったかを確認するフラグ

  // 各試合の結果をチェック
  for (const eventId in selectedOdds) {
    const selectedChoice = selectedOdds[eventId];
    const oddsData = data2.odds[eventId];
    const selectedChoiceIndex = ['win', 'draw', 'defeat'].indexOf(selectedChoice.choiceType);

    if (oddsData.choices[selectedChoiceIndex]?.winning !== true) {
      allBetsWon = false; // 1つでも外れた場合はフラグをfalseに
      break;
    }
  }

  // すべてのベットが的中した場合
  if (allBetsWon) {
    const newBalance = (balance - betAmount) + predictedAmount;
    setBalance(newBalance); // UI上の残高を更新

    // Firestoreのユーザーデータを更新
    const userRef = doc(db, "users", auth.currentUser.uid);
    await updateDoc(userRef, { balance: newBalance });

    alert('All bets won! Your balance has been updated.');
  } else {
    const newBalance = balance - betAmount; // 負けた場合、ベット金額を引く
    setBalance(newBalance); // UI上の残高を更新

    // Firestoreのユーザーデータを更新
    const userRef = doc(db, "users", auth.currentUser.uid);
    await updateDoc(userRef, { balance: newBalance });

    alert('One or more bets lost. Your balance has been updated.');
  }
};


  // 次の画面に進む処理（ログイン状態をチェック）
  const handleNavigate = () => {
    if (!isLoggedIn) {
      // ログインしていない場合は、ログイン画面にリダイレクト
      navigate("/signIn");
    } else {
      if (betAmount > balance) {
        setErrorMessage("Your bet amount exceeds your available balance.");
      } else {
        // ベット結果の確認処理
        handleBetResult();
        navigate("/nextPage");  // 次の画面（ここでは仮のURL）
      }
    }
  };

  return (
    <div className="bg-gray-400 grid grid-cols-1 divide-y text-black">
      {data.events.map((event) => {
        const oddsData = data2.odds[event.id]; // event.id と odds のキーを一致させる

        return (
          <div key={event.id || event.customId} className="bg-white py-2">
            {/* Season Name */}
            <div className="flex justify-center">
              {event.season ? event.season.name : "No Season Name"}
            </div>

            {/* Fixture details with flexbox for alignment */}
            <div className="w-full flex p-1 items-center">
              <div className="w-[32%] text-left">
                {event.homeTeam ? event.homeTeam.name : "No Home Team"}
              </div>
              <div className="w-[36%] text-center">
                {event.homeScore ? event.homeScore.current : "-"} : {event.awayScore ? event.awayScore.current : "-"}
              </div>
              <div className="w-[32%] text-right">
                {event.awayTeam ? event.awayTeam.name : "No Away Team"}
              </div>
            </div>

            {/* オッズの詳細表示 */}
            {oddsData && (
              <div className="mt-4">
                <div className="grid grid-cols-3 gap-4">
                  <div
                    className={`text-center p-2 ${selectedOdds[event.id]?.choiceType === 'win' ? "bg-green-500 text-white font-bold" : ""}`}
                    onClick={() => handleOddsClick(event.id, 'win', convertFractionalToDecimal(oddsData.choices[0]?.fractionalValue).toFixed(2))}
                  >
                    <h3 className="text-lg font-semibold">Win</h3>
                    <p className="text-xl text-blue-500">
                      {oddsData.choices[0]?.fractionalValue ? convertFractionalToDecimal(oddsData.choices[0]?.fractionalValue).toFixed(2) : "N/A"}
                    </p>
                  </div>

                  <div
                    className={`text-center p-2 ${selectedOdds[event.id]?.choiceType === 'draw' ? "bg-yellow-500 text-white font-bold" : ""}`}
                    onClick={() => handleOddsClick(event.id, 'draw', convertFractionalToDecimal(oddsData.choices[1]?.fractionalValue).toFixed(2))}
                  >
                    <h3 className="text-lg font-semibold">Draw</h3>
                    <p className="text-xl text-green-500">
                      {oddsData.choices[1]?.fractionalValue ? convertFractionalToDecimal(oddsData.choices[1]?.fractionalValue).toFixed(2) : "N/A"}
                    </p>
                  </div>

                  <div
                    className={`text-center p-2 ${selectedOdds[event.id]?.choiceType === 'defeat' ? "bg-red-500 text-white font-bold" : ""}`}
                    onClick={() => handleOddsClick(event.id, 'defeat', convertFractionalToDecimal(oddsData.choices[2]?.fractionalValue).toFixed(2))}
                  >
                    <h3 className="text-lg font-semibold">Defeat</h3>
                    <p className="text-xl text-blue-500">
                      {oddsData.choices[2]?.fractionalValue ? convertFractionalToDecimal(oddsData.choices[2]?.fractionalValue).toFixed(2) : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Bet Amount Input and Predicted Earnings */}
            <div className="fixed bottom-4 left-4 p-4 bg-gray-100 rounded-md w-72">
              <h3 className="text-lg font-semibold">Enter Bet Amount</h3>
              <input
                type="number"
                value={betAmount}
                onChange={handleBetAmountChange}
                className="p-2 w-full border rounded-md"
                placeholder="Enter amount"
              />
              {errorMessage && <p className="text-red-500">{errorMessage}</p>}
              <div className="mt-2">
                <h3 className="text-lg">Total Odds:</h3>
                <p className="text-2xl font-bold">{totalOdds.toFixed(2)}</p>
              </div>
              <div className="mt-2">
                <h3 className="text-lg">Predicted Earnings:</h3>
                <p className="text-2xl font-bold">{predictedAmount.toFixed()}</p>
              </div>
              <button
                onClick={handleNavigate}
                className={`mt-4 w-full p-2 rounded-md ${betAmount <= balance ? 'bg-blue-500' : 'bg-gray-300 cursor-not-allowed'}`}
                disabled={betAmount > balance}
              >
                Go to Next Page
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}