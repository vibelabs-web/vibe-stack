import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Home } from './pages/Home';
import { Profile } from './pages/Profile';
import { Ranking } from './pages/Ranking';
import { WritePost } from './pages/WritePost';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/write" element={<WritePost />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
