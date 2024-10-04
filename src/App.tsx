import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Outlet } from 'react-router';
import NavBar from './shared/Navbar';

function App() {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
}

export default App;
