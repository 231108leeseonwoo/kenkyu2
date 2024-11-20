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

  // oddsはオブジェクトなので、その値を配列に変換する
  const events = Object.values(data.odds); // oddsオブジェクトの値を配列に変換

  return (
    <div className="bg-gray-400 grid grid-cols-1 divide-y text-black">
      {events.map((odds) => (
        // odds.id がユニークであると仮定していますが、もし重複の可能性があれば
        // odds.id と市場名 (odds.marketName) を組み合わせて key を生成できます
        <Link to={`/oddsDetail/${odds.id}`} key={odds.id}>
          <div className="bg-white py-2">
            <div className="flex justify-center">
              {/* marketName と marketId を表示 */}
              <div>
                <p>Market Name: {odds.marketName}</p>
                <p>Market ID: {odds.marketId}</p>
              </div>
            </div>
          </div>
          <div className="text-center text-green-600">
            {/* 必要に応じて他のコンテンツをここに追加できます */}
          </div>
        </Link>
      ))}
    </div>
  );
}
