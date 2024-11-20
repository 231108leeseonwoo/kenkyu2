/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
import React from "react";
import { useParams } from "react-router-dom";
import BALLIMG from "../assets/images/1.png";
import { useEffect, useState } from "react";

export default function Fixture({ data }) {
    const params = useParams();
    const matchID = params.customId;

    const result = data.events.filter((match) => {
        return match.customId == matchID;
    });

    const fixture = result[0];

    const [currentTime, setCurrentTime] = useState(Date.now() / 1000);  // 現在のUNIXタイムスタンプ（秒）

    // useEffectで毎秒タイムスタンプを更新
    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentTime(Date.now() / 1000);
      }, 1000);  // 1秒ごとに更新
    
      return () => clearInterval(interval);  // コンポーネントがアンマウントされた時にインターバルをクリア
    }, []);


    return (
        <div className="bg-white pb-10">
            <div className="bg-white py-2">
                <div align="center">
                    {fixture.season.name}
                </div>

                <div className="text-center">
                    {fixture.status.description}
                </div>

                <div className="w-full flex p-1">
                    <div className="w-[32%] text-right">
                        {fixture.homeTeam.name}
                    </div>

                    <div className="w-[36%] text-center">
                        {fixture.homeScore.current} : {fixture.awayScore.current}
                    </div>

                    <div className="w-[32%] text-left">
                        {fixture.awayTeam.name}
                    </div>
                </div>

                <div className="text-center text-green-600">
              {/* 経過時間が存在する場合のみ表示 */}
              {fixture.statusTime && fixture.statusTime.timestamp ? (
                // 試合の開始時刻と現在時刻から経過時間を計算
                (() => {
                  const elapsedTime = currentTime - fixture.statusTime.timestamp;  // 経過時間（秒）
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
                <span>{fixture.status.description}</span>
              )}
            </div>
            </div>

            {/* イベント情報の表示 */}
            <div align="center" className="grid grid-cols-1 divide-y">
                <h1 className="bg-gray-700 p-1 text-gray-300 text-xl">Events</h1>
                
                {fixture.events && fixture.events.length > 0 ? (
                    fixture.events.map((event) => (
                        <div className="p-5" key={event.team.id}>
                            <div>
                                <img src={BALLIMG} width={15} alt="GOAL" />
                            </div>
                            {event.player.name}
                            <br />
                        </div>
                    ))
                ) : (
                    <div>No events found</div>
                )}
            </div>

            {/* スコアの表示 */}
            {/* <div align="center" className="grid grid-cols-1 divide-y">
                <h1 className="bg-gray-700 p-1 text-gray-300 text-xl">Score</h1>
                <div className="p-2">
                    First Half
                    <br />
                    {fixture.score.halftime.home} : {fixture.score.halftime.away}
                </div>
                {fixture.score.fulltime.home ? (
                    <div className="p-2">
                        Full Time
                        <br />
                        {fixture.score.fulltime.home} : {fixture.score.fulltime.away}
                    </div>
                ) : null}

                {fixture.score.fulltime.home ? (
                    <div className="p-2">
                        Extra Time
                        <br />
                        {fixture.score.extratime.home} : {fixture.score.extratime.away}
                    </div>
                ) : null}

                {fixture.score.fulltime.home ? (
                    <div className="p-2">
                        Penalty
                        <br />
                        {fixture.score.penalty.home} : {fixture.score.penalty.away}
                    </div>
                ) : null}
            </div> */}
         
                     

   
        </div>
    );
}