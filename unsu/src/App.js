import './App.css';
import Footter from './components/Footter';
import Header from './components/Header';
import Home from './components/Home';
import SideBar from './components/SideBar';
import { Route, Routes } from 'react-router';
import { Suspense, lazy, useCallback, useEffect } from 'react';
import LoadingScreen from './components/LoadingScreen';
import Login from './components/integrated/Login';

const App = () => {
  return (
    <>
      {/* 메뉴 */}
      <Header />

      <div className='container-fluid d-flex'>
        <div className='sideber'>
          <SideBar />
        </div>
        {/* 바디 */}
        <div className='row mt-4'>
          <div className='col-10 offset-sm-1'>
            <Suspense fallback={<LoadingScreen />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
              </Routes>
            </Suspense>
          </div>
        </div>
      </div>
      <Footter />
    </>
  );
}

export default App;