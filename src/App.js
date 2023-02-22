import './App.css';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Signup } from './components/Signup';
import { Login } from './components/Login';
import { Home } from './components/Home';
import { CreateRoom } from './components/createRoom';
import { AddFriend } from './components/AddFriend';
import { IncomeFriendRequest } from './components/IncomeFriendRequest';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path='/createroom' element={<CreateRoom/>}/>
        <Route path='/addfriend' element={<AddFriend/>}/>
        <Route path='/incomefriendrequest' element={<IncomeFriendRequest/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;