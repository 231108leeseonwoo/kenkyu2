/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Table({ data }) {
  const [currentTime, setCurrentTime] = useState(Date.now() / 1000);  // 現在のUNIXタイムスタンプ（秒）

  // useEffectで毎秒タイムスタンプを更新
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now() / 1000);
    }, 1000);  // 1秒ごとに更新

    return () => clearInterval(interval);  // コンポーネントがアンマウントされた時にインターバルをクリア
  }, []);

  if (!data || !data.events || data.events.length === 0) {
    return <div>Loading...</div>;  // データがない場合のエラーハンドリング
  }

  return (
    <div className="bg-gray-400 grid grid-cols-1 divide-y text-black">
      {data.events.map((events) => (
        <Link to={`/events/${events.customId}`} key={events.customId}>
          <div className="bg-white py-2">
            {/* Season Name */}
            <div className="flex justify-center">
              {events.season ? events.season.name : "No season name"}
            </div>

            <div className="flex justify-center">
              {events.status ? events.status.description : "No status"}
            </div>

            {/* Fixture details with flexbox for alignment */}
            <div className="w-full flex p-1 items-center">
              {/* Home Team */}
              <div className="w-[32%] text-left">
                {events.homeTeam ? events.homeTeam.name : "No home team"}
              </div>

              {/* Score */}
              <div className="w-[36%] text-center">
                {events.homeScore && events.homeScore.current !== undefined
                  ? events.homeScore.current
                  : "0"}{" "}
                :{" "}
                {events.awayScore && events.awayScore.current !== undefined
                  ? events.awayScore.current
                  : "0"}
              </div>

              {/* Away Team */}
              <div className="w-[32%] text-right">
                {events.awayTeam ? events.awayTeam.name : "No away team"}
              </div>
            </div>

            {/* Display elapsed time or match status */}
            <div className="text-center text-green-600">
              {/* 経過時間が存在する場合のみ表示 */}
              {events.statusTime && events.statusTime.timestamp ? (
                // 試合の開始時刻と現在時刻から経過時間を計算
                (() => {
                  const elapsedTime = currentTime - events.statusTime.timestamp;  // 経過時間（秒）
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
                <span>{events.status ? events.status.description : "No status"}</span>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
