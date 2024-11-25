import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firestoreインスタンスの取得
const db = getFirestore();

// Firebase Authenticationのインスタンスの取得
const auth = getAuth();

// 新しいユーザーをFirestoreに作成する関数
const createUser = async (nickname, balance) => {
  const userId = auth.currentUser.uid;  // 現在ログインしているユーザーのIDを取得
  
  try {
    // ユーザー情報をFirestoreの`users`コレクションに保存
    await setDoc(doc(db, "users", userId), {
      nickname: nickname,  // ユーザーのニックネーム
      balance: balance,  // ユーザーの暗号資産残高（外部APIから取得したもの）
      bettingHistory: [],  // ベッティング履歴（初期は空の配列）
      rank: "bronze"  // 初期ランク（仮にbronzeとする）
    });

    console.log("User created successfully!");
  } catch (error) {
    console.error("Error creating user:", error);
  }
};

export default createUser;
