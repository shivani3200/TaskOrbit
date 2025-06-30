import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import SignUp from './components/SignUp'
import LogIn from './components/LogIn'
import DashBoard from './components/DashBoard';
import DashBoardPage from './components/DashBoardPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path = '/' element={<SignUp/>}/>
        <Route path='signin' element={<LogIn/>}/>
        <Route path ='/dashboard' element={<DashBoardPage/>}/>

      </Routes>
    </Router>
  )
}

export default App;
