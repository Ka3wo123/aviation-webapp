import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import RegistrationForm from './components/authenticate/RegistrationForm';
import AuthPage from './components/authenticate/Auth';
import NotFound from './components/handler-pages/NotFound';
import HomePage from './components/HomePage';
import AviationMap from './components/AviationMap';
import FlightForm from './components/FlightSearch';
import UserFlights from './components/UserFlights';
import ResetPassword from './components/handler-pages/ResetPassword';
import ForgotPassword from './components/handler-pages/ForgotPassword';
import AirlinesList from './components/AirlinesList';
import AdminDashboard from './components/admin/AdminDashboard';
import { jwtDecode } from 'jwt-decode';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const isAdmin = () => {
  const token = localStorage.getItem('accessToken');

  if (token) {
    try {
      const decoded: { exp?: number, roles?: string } = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      const isExpired = decoded.exp ? decoded.exp < currentTime : true;
      return decoded.roles?.includes('ADMIN') && !isExpired;
    } catch (error) {
      console.error('Invalid token:', error);
    }
  }
  return false;
};

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />}>
          <Route path='/' element={<HomePage />} />
          <Route path='/auth' element={<AuthPage />} />
          <Route path='/register' element={<RegistrationForm />} />
          <Route path='/airports/map' element={<AviationMap />} />
          <Route path='/airlines' element={<AirlinesList />} />
          <Route path='/flight/search' element={<FlightForm />} />
          <Route path='/user/flights/:email' element={<UserFlights />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route
            path="/admin-dashboard"
            element={isAdmin() ? <AdminDashboard /> : <NotFound />}
          />
          <Route path='/*' element={<NotFound></NotFound>} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
