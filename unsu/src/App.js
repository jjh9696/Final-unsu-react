import './App.css';
import Footter from './components/Footter';
import Header from './components/Header';
import SideBar from './components/SideBar';
import AdminSideBar from './components/integrated/admin/AdminSideBar';
import { Route, Routes } from 'react-router';
import { useRecoilState, useRecoilValue } from "recoil";
import { Suspense, lazy, useCallback, useEffect } from 'react';
import { loginIdState, loginLevelState, isLoginState, isAdminState } from './components/utils/RecoilData';
import LoadingScreen from './components/LoadingScreen';
import axios from './components/utils/CustomAxios';
import { Link } from 'react-router-dom';
import NoticeAdd from './components/integrated/NoticeAdd';
import NoticeDetail from './components/integrated/NoticeDetail';

import NoticeAdd from './components/integrated/NoticeAdd';
import NoticeDetail from './components/integrated/NoticeDetail';

// 컴포넌트 배치

const AdminHome = lazy(()=>import("./components/integrated/admin/AdminHome"));
const Home = lazy(()=>import("./components/Home"));
const Join = lazy(()=>import("./components/integrated/Join"));
const Notice = lazy(()=>import("./components/integrated/Notice"));
const Login = lazy(()=>import("./components/integrated/Login"));



const App = () => {

  // recoil state
  const [loginId, setLoginId] = useRecoilState(loginIdState);
  const [loginLevel, setLoginLevel] = useRecoilState(loginLevelState);

  // recoil value
  const isLogin = useRecoilValue(isLoginState);
  const isAdmin = useRecoilValue(isAdminState);


  //effect
  useEffect(() => {
    refreshLogin();
  }, []);//최초 1회

  //callback
  const refreshLogin = useCallback(async () => {
    //localStorage에 있는 refreshToken의 유무에 따라 로그인 처리를 수행
    const refreshToken = window.localStorage.getItem("refreshToken");
    //console.log(refreshToken);
    if (refreshToken !== null) {//refreshToken 항목이 존재한다면
      //리프레시 토큰으로 Authorization을 변경하고
      axios.defaults.headers.common["Authorization"] = refreshToken;
      //재로그인 요청을 보낸다
      const resp = await axios.post("/member/refresh");
      //결과를 적절한 위치에 설정한다
      setLoginId(resp.data.memberId);
      setLoginLevel(resp.data.memberLevel);
      axios.defaults.headers.common["Authorization"] = resp.data.accessToken;
      window.localStorage.setItem("refreshToken", resp.data.refreshToken);
    }
  }, []);
  return (
    <>
      {/* 메뉴 */}
      <Header />
      
      <div className='container-fluid d-flex'>
        <div className='sidebar'>
          {isAdmin && (<div className='text-end'><Link to="/adminhome">관리자홈</Link></div>)}
          {isAdmin ? (
            <>
            <AdminSideBar/>
            </>
          ):(
            <>
            <SideBar/>
            </>
          )}
        </div>
        <div className='container'>
          <div className='row mt-4'>
            <div className='col-10 offset-sm-1'>
            <Suspense fallback={<LoadingScreen />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/notice" element={<Notice />} />
                <Route path="/join" element={<Join />} />
                <Route path="/adminHome" element={<AdminHome />} />
                <Route path="/noticeAdd" element={<NoticeAdd />} />
                <Route path="/noticeDetail/:noticeNo" element={<NoticeDetail/>} />
              </Routes>
            </Suspense>
            </div>
          </div>
        </div>
      </div>
      <div className='row'>
        <div className='col'>
          <Footter />
        </div>
      </div>
    </>
  );
}

export default App;