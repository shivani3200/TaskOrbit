import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
  orderBy,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import "../cssFolder/DashBoard.css";

const DashBoard = () => {
  const [user, loadingUser, errorUser] = useAuthState(auth);
  const [boards, setBoards] = useState([]);
  const [loadingBoard, setLoadingBoard] = useState(true);
  const [errorBoards, setErrorBoards] = useState(null);
  const [newBoardName, setNewBoardName] = useState("");

  useEffect(() => {
    const fetchBoards = async () => {
      if (!user) {
        setBoards([]);
        setLoadingBoard(false);
        return;
      }

      setLoadingBoard(true);
      setErrorBoards(null);

      try {
        const q = query(
          collection(db, "boards"),
          where("ownerId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBoards(data);
      } catch (err) {
        setErrorBoards("Failed to load boards.");
      } finally {
        setLoadingBoard(false);
      }
    };
    fetchBoards();
  }, [user]);

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    if (!newBoardName.trim()) return alert("Board name is required");
    if (!user) return alert("Login required");

    try {
      const docRef = await addDoc(collection(db, "boards"), {
        name: newBoardName.trim(),
        ownerId: user.uid,
        createdAt: serverTimestamp(),
      });
      setBoards((prev) => [
        {
          id: docRef.id,
          name: newBoardName.trim(),
          ownerId: user.uid,
          createdAt: new Date(),
        },
        ...prev,
      ]);
      setNewBoardName("");
    } catch (err) {
      console.error("Add board error:", e);
      alert("Could not create board.");
    }
  };

  if (loadingUser || loadingBoard) {
    return <div>Loading Dashboard...</div>;
  }
  if (errorUser) {
    return <div>Error fetching user: {errorUser.message}</div>;
  }
  if (errorBoards) {
    return <div>{errorBoards}</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-heading">My Boards</div>
      <form onSubmit={handleCreateBoard} className="create-board-form">
        <input
          className="new-board-input"
          placeholder="board name"
          value={newBoardName}
          onChange={(e) => {
            setNewBoardName(e.target.value);
          }}
        />
        <button type={submit} className="create-board-button">
          Create Board
        </button>
      </form>

      {boards.length === 0 ? (
        <p>You don't have any boards yet. Create your first!</p>
      ) : (
        <div className="boards-grids">
          {boards.map((board) => (
            <Link
              to={`/board/${board.id}`}
              key={board.id}
              className="board-card"
            >
              <h3>{board.name}</h3>
              {board.createdAt && (
                <p className="board-date">
                  Created:
                  {new Date(
                    board.createdAt.toDate?.() || board.createdAt
                  ).toLocaleDateString()}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashBoard;
