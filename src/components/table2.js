/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
import React from "react";
import { Link } from "react-router-dom";

// eslint-disable-next-line react/prop-types
export default function Table2({ data }) {
  // data と odds が存在するか、またoddsがオブジェクトであることを確認
  if (!data || typeof data.odds !== 'object') {
    return <div>Loading...</div>; // データが不正な場合やまだ読み込まれていない場合
  }

  // oddsはオブジェクトなので、そのキーを取得
  const oddsKeys = Object.keys(data.odds);  // 例: ['11351583', '11352560', ...]

  // fractionalValueを倍数に変換する関数
  const convertFractionalToMultiplier = (fractionalValue) => {
    if (!fractionalValue) return null;
    const [numerator, denominator] = fractionalValue.split("/").map(Number);
    return numerator && denominator ? (numerator / denominator + 1).toFixed(2) : null; // 1を足して倍数に変換
  };

  // "的中" のデザインクラスを決定する関数
  const getWinningClass = (isWinning) => {
    return isWinning ? "bg-green-500 text-white font-bold" : ""; // 的中した場合は緑色の背景
  };

  return (
    <div className="bg-gray-400 grid grid-cols-1 divide-y text-black">
      {/* odds の各キーをループして処理 */}
      {oddsKeys.map((key) => {
        const odds = data.odds[key];  // 現在のキーのオッズデータを取得
        return (
          <Link to={`/oddsDetail/${odds.id}`} key={odds.id}>
            <div className="bg-white py-4 px-6 rounded-lg shadow-md my-2">
              <div className="text-center mb-4">
                {/* 競技ごとのオッズ */}
                <h2 className="text-xl font-bold mb-2">Market ID: {odds.marketName}</h2>
                <p className="text-sm text-gray-600">ID: {odds.id}</p>
              </div>

              {/* オッズの詳細表示 */}
              <div className="grid grid-cols-3 gap-4">
                {/* Win */}
                <div className={`text-center p-2 ${getWinningClass(odds.choices[0]?.winning)}`}>
                  <h3 className="text-lg font-semibold">Win</h3>
                  <p className="text-xl text-blue-500">
                    {convertFractionalToMultiplier(odds.choices[0]?.fractionalValue)}x
                    <span className="text-sm text-gray-500">
                      【{convertFractionalToMultiplier(odds.choices[0]?.initialFractionalValue)}x】
                    </span>
                  </p>
                </div>

                {/* Draw */}
                <div className={`text-center p-2 ${getWinningClass(odds.choices[1]?.winning)}`}>
                  <h3 className="text-lg font-semibold">Draw</h3>
                  <p className="text-xl text-yellow-500">
                    {convertFractionalToMultiplier(odds.choices[1]?.fractionalValue)}x
                    <span className="text-sm text-gray-500">
                      【{convertFractionalToMultiplier(odds.choices[1]?.initialFractionalValue)}x】
                    </span>
                  </p>
                </div>

                {/* Defeat */}
                <div className={`text-center p-2 ${getWinningClass(odds.choices[2]?.winning)}`}>
                  <h3 className="text-lg font-semibold">Defeat</h3>
                  <p className="text-xl text-red-500">
                    {convertFractionalToMultiplier(odds.choices[2]?.fractionalValue)}x
                    <span className="text-sm text-gray-500">
                      【{convertFractionalToMultiplier(odds.choices[2]?.initialFractionalValue)}x】
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
