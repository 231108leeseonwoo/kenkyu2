/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
//2
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// eslint-disable-next-line react/prop-types
export default function Table4({ data }) {

  return (
    <div className="bg-gray-400 grid grid-cols-1 divide-y text-black">
      {/* eventsが2次元配列なので、最初にグループ（eventGroup）をループ */}
      {data.events.map((eventGroup, groupIndex) => (
        <React.Fragment key={groupIndex}>
          {/* 各グループ内のイベントをループ */}
          {eventGroup.map((event) => (
            <Link to={`/events/${event.customId}`} key={event.customId}>
              <div className="bg-white py-2">
                {/* Season Name */}
                <div className="flex justify-center">
                  {event.season ? event.season.name : "No Season Name"}
                </div>
                {/* Event Custom ID */}
                <div className="flex justify-center">
                  {event.customId}
                </div>
              </div>
            </Link>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
}
