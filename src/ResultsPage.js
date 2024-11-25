import React, { useState, useEffect } from "react";
import { auth } from "./firebase-config";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase-config";

const ResultsPage = () => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserInfo(userDoc.data());
        }
      }
    };

    fetchUserInfo();
  }, []);

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <h2>My Profile</h2>
      <p><strong>Nickname:</strong> {userInfo.nickname}</p>
      <p><strong>Rank:</strong> {userInfo.rank}</p>
    </div>
  );
};

export default ResultsPage;
