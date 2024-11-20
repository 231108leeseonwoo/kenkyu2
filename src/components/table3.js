/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
//2
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// eslint-disable-next-line react/prop-types
export default function Table3({ data }) {
  const [currentTime, setCurrentTime] = useState(Date.now() / 1000);  // 現在のUNIXタイムスタンプ（秒）

  // useEffectで毎秒タイムスタンプを更新
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now() / 1000);
    }, 1000);  // 1秒ごとに更新

    return () => clearInterval(interval);  // コンポーネントがアンマウントされた時にインターバルをクリア
  }, []);

  return (
    <div className="bg-gray-400 grid grid-cols-1 divide-y text-black">
      {data.events.map((events) => (
        <Link to={`/events/${events.customId}`} key={events.customId}>
          <div className="bg-white py-2">
            {/* Season Name */}
            <div className="flex justify-center">
              {events.season.name}
            </div>

            <div className="flex justify-center">
              {events.status.description}
            </div>

            {/* Fixture details with flexbox for alignment */}
            <div className="w-full flex p-1 items-center">
              {/* Home Team */}
              <div className="w-[32%] text-left">
                {events.homeTeam.name}
              </div>

              {/* Score */}
              <div className="w-[36%] text-center">
                {events.homeScore.current} : {events.awayScore.current}
              </div>

              {/* Away Team */}
              <div className="w-[32%] text-right">
                {events.awayTeam.name}
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
                <span>{events.status.description}</span>
              )}
            </div>

          </div>
        </Link>
      ))}
    </div>
  );
}