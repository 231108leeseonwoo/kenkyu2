/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// eslint-disable-next-line react/prop-types
export default function Table4({ data }) {
  const [currentTime, setCurrentTime] = useState(Date.now() / 1000);  // 現在のUNIXタイムスタンプ（秒）

  // useEffectで毎秒タイムスタンプを更新
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now() / 1000);
    }, 1000);  // 1秒ごとに更新

    return () => clearInterval(interval);  // コンポーネントがアンマウントされた時にインターバルをクリア
  }, []);

  // `data` や `data.events` が存在するか確認し、データが存在しない場合は "Loading..." を表示
  if (!data || !Array.isArray(data.events) || data.events.length === 0) {
    return <div>Loading...</div>;  // データがまだロードされていない場合、または空の場合
  }

  return (
    <div className="bg-gray-400 grid grid-cols-1 divide-y text-black">
      {/* data.events は単一の配列なので、直接 map でループ */}
      {data.events.map((event) => (
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

          </div>
        </Link>
      ))}
    </div>
  );
}
