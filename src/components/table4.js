/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// eslint-disable-next-line react/prop-types
export default function Table4({ data, data2 }) {
  const [currentTime, setCurrentTime] = useState(Date.now() / 1000);  // 現在のUNIXタイムスタンプ（秒）

  // useEffectで毎秒タイムスタンプを更新
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now() / 1000);
    }, 1000);  // 1秒ごとに更新

    return () => clearInterval(interval);  // コンポーネントがアンマウントされた時にインターバルをクリア
  }, []);

  // `data` や `data.events` が存在するか確認し、データが存在しない場合は "Loading..." を表示
  if ((!data || !Array.isArray(data.events) || data.events.length === 0) || (!data2 || !data2.odds)) {
    return <div>Loading...</div>;  // データがまだロードされていない場合、または空の場合
  }

  return (
    <div className="bg-gray-400 grid grid-cols-1 divide-y text-black">
      {/* data.events は単一の配列なので、直接 map でループ */}
      {data.events.map((event) => {
        // odds オブジェクト内のキーと一致するものを取得
        const oddsData = data2.odds[event.id]; // event.id と odds のキーを一致させる

        return (
          <Link to={`/events/${event.customId}`} key={event.customId}>
            <div className="bg-white py-2">
              {/* Season Name */}
              <div className="flex justify-center">
                {event.season ? event.season.name : "No Season Name"}
              </div>

              <div className="flex justify-center">
                {event.status.description}
              </div>

              {/* Fixture details with flexbox for alignment */}
              <div className="w-full flex p-1 items-center">
                {/* Home Team */}
                <div className="w-[32%] text-left">
                  {event.homeTeam ? event.homeTeam.name : "No Home Team"}
                </div>

                {/* Score */}
                <div className="w-[36%] text-center">
                  {event.homeScore ? event.homeScore.current : "-"} : {event.awayScore ? event.awayScore.current : "-"}
                </div>

                {/* Away Team */}
                <div className="w-[32%] text-right">
                  {event.awayTeam ? event.awayTeam.name : "No Away Team"}
                </div>
              </div>

              {/* Display elapsed time or match status */}
              <div className="text-center text-green-600">
                {/* 経過時間が存在する場合のみ表示 */}
                {event.statusTime && event.statusTime.timestamp ? (
                  // 試合の開始時刻と現在時刻から経過時間を計算
                  (() => {
                    const elapsedTime = currentTime - event.statusTime.timestamp;  // 経過時間（秒）
                    const minutes = Math.floor(elapsedTime / 60);  // 分
                    const seconds = Math.floor(elapsedTime % 60);  // 秒

                    return (
                      <span>
                        {minutes}:{seconds < 10 ? '0' + seconds : seconds}
                      </span>
                    );
                  })()
                ) : (
                  // 経過時間がない場合、進行状況を表示
                  <span>{event.status.description}</span>
                )}
              </div>

              {/* オッズの詳細表示（oddsDataが存在する場合） */}
              {oddsData && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold">Odds for {event.homeTeam.name} vs {event.awayTeam.name}</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {/* Win */}
                    <div className={`text-center p-2 ${oddsData.choices[0]?.winning ? "bg-green-500 text-white font-bold" : ""}`}>
                      <h3 className="text-lg font-semibold">Win</h3>
                      <p className="text-xl text-blue-500">
                        {oddsData.choices[0]?.fractionalValue}x
                        <span className="text-sm text-gray-500">
                          【{oddsData.choices[0]?.initialFractionalValue}x】
                        </span>
                      </p>
                    </div>

                    {/* Draw */}
                    <div className={`text-center p-2 ${oddsData.choices[1]?.winning ? "bg-green-500 text-white font-bold" : ""}`}>
                      <h3 className="text-lg font-semibold">Draw</h3>
                      <p className="text-xl text-yellow-500">
                        {oddsData.choices[1]?.fractionalValue}x
                        <span className="text-sm text-gray-500">
                          【{oddsData.choices[1]?.initialFractionalValue}x】
                        </span>
                      </p>
                    </div>

                    {/* Defeat */}
                    <div className={`text-center p-2 ${oddsData.choices[2]?.winning ? "bg-green-500 text-white font-bold" : ""}`}>
                      <h3 className="text-lg font-semibold">Defeat</h3>
                      <p className="text-xl text-red-500">
                        {oddsData.choices[2]?.fractionalValue}x
                        <span className="text-sm text-gray-500">
                          【{oddsData.choices[2]?.initialFractionalValue}x】
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
