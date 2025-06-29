// ✅ Slice = combines state + reducer functions + action creators
// ✅ addBoard() → adds a new board to state
// ✅ removeBoard() → removes board by id

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  boards: [],  // Initial state of our 'board' slice → empty array of boards
}

const boardSlice = createSlice(
  {
    name:'board', // Name of this slice → will be used in dev tools
    initialState, // Initial state to start with
    reducers:{
      addBoard:(state,action) =>{
        state.boards.push(action.payload);
      },
      removeBoard:(state,action) =>{
        state.boards = state.boards.filter(board => board.id !== action.payload)
      }
    }
  }
)

export const {addBoard, removeBoard} = boardSlice.actions;
export default boardSlice.reducer;