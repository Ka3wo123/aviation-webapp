import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Route, Routes } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import Users from './components/Users';
import RegistrationForm from './components/authenticate/RegistrationForm';
import AuthPage from './components/authenticate/Auth';
import 'bootstrap/dist/css/bootstrap.min.css';
import NotFound from './components/handler-pages/NotFound';
import HomePage from './components/HomePage';
import AviationMap from './components/AviationMap';
import FlightForm from './components/FlightSearch';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />}>
          <Route path='/' element={<HomePage/>} />         
          <Route path='/auth' element={<AuthPage/>} />
          <Route path='/register' element={<RegistrationForm />} />
          <Route path='/users' element={<Users />} />
          <Route path='/airports/map' element={<AviationMap/>} />
          <Route path='/flight/assigning-form' element={<FlightForm/>} />
          <Route path='/*' element={<NotFound></NotFound>} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
