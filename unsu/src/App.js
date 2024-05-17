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
import RoundTrip from "./components/RoundTrip";
import { Link } from "react-router-dom";

// 컴포넌트 배치

const AdminHome = lazy(() => import("./components/integrated/admin/AdminHome"));
const Join = lazy(() => import("./components/integrated/member/Join"));
const Login = lazy(() => import("./components/integrated/member/Login"));
const Mypage = lazy(() => import("./components/integrated/member/Mypage"));
const TestJoin = lazy(() => import("./components/integrated/member/TestJoin"));
const OneWay = lazy(() => import("./components/OneWay"));
const Notice = lazy(() => import("./components/integrated/notice/Notice"));
const NoticeAdd = lazy(() => import("./components/integrated/notice/NoticeAdd"));
const NoticeDetail = lazy(() => import("./components/integrated/notice/NoticeDetail"));
const Driver = lazy(() => import("./components/integrated/admin/Driver"));
const Bus = lazy(() => import("./components/integrated/admin/Bus"));
const RouteMap = lazy(() => import("./components/integrated/admin/Route"));
const Reservation = lazy(() => import("./components/integrated/Reservation"));
const Terminal = lazy(() => import("./components/integrated/admin/Terminal"));
const TestPrice = lazy(() => import("./components/TestPrice"));
const ReviewList = lazy(() => import("./components/integrated/review/ReviewList"));
const Chatbot = lazy(() => import("./components/integrated/websocket/chatbot"));
const ChatbotEdit = lazy(() => import("./components/integrated/websocket/chatbotEdit"));
const MemberChat = lazy(() => import("./components/integrated/websocket/memberChat"));
const RefundInfo = lazy(() => import("./components/doc/RefundInfo"));
const TerminalInfo = lazy(() => import("./components/doc/TerminalInfo"));
const PayInfo = lazy(() => import("./components/doc/PayInfo"));
const Charge = lazy(() => import("./components/integrated/admin/Charge"));
const MemberList = lazy(() => import("./components/integrated/admin/MemberList"));
const PointList = lazy(() => import("./components/integrated/admin/PointList"));
const Point = lazy(() => import("./components/integrated/member/Point"));
const OrderEnd = lazy(() => import("./components/integrated/member/OrderEnd"));
const OrderList = lazy(() => import("./components/integrated/member/OrderList"));
const Home = lazy(() => import("./components/Home"));
const ReservationList = lazy(() => import("./components/integrated/admin/ReservationList"));

const App = () => {
  // recoil state
  const [loginId, setLoginId] = useRecoilState(loginIdState);
  const [loginLevel, setLoginLevel] = useRecoilState(loginLevelState);

  // recoil value
  const isLogin = useRecoilValue(isLoginState);
  const isAdmin = useRecoilValue(isAdminState);

  // effect
  useEffect(() => {
    refreshLogin();
  }, []); // 최초 1회

  // callback
  const refreshLogin = useCallback(async () => {
    // localStorage에 있는 refreshToken의 유무에 따라 로그인 처리를 수행
    const refreshToken = window.localStorage.getItem("refreshToken");
    if (refreshToken !== null) { // refreshToken 항목이 존재한다면
      // 리프레시 토큰으로 Authorization을 변경하고
      axios.defaults.headers.common["Authorization"] = refreshToken;
      // 재로그인 요청을 보낸다
      const resp = await axios.post("/member/refresh");
      // 결과를 적절한 위치에 설정한다
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
          {isAdmin ? (
            <AdminSideBar />
          ) : (
            <SideBar />
          )}
        </div>
        <div className='container'>
          <div className='row mt-4'>
            <div className='col-10 offset-sm-1'>
              <Suspense fallback={<LoadingScreen />}>
                <Routes>
                  <Route path="/reservation" element={<Reservation />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/notice" element={<Notice />} />
                  <Route path="/join" element={<Join />} />
                  <Route path="/adminHome" element={<AdminHome />} />
                  <Route path="/driver" element={<Driver />} />
                  <Route path="/bus" element={<Bus />} />
                  <Route path="/noticeAdd" element={<NoticeAdd />} />
                  <Route path="/noticeDetail/:noticeNo" element={<NoticeDetail />} />
                  <Route path="/mypage" element={<Mypage />} />
                  <Route path="/testjoin" element={<TestJoin />} />
                  <Route path="/oneWay" element={<OneWay />} />
                  <Route path="/roundTrip" element={<RoundTrip />} />
                  <Route path="/route" element={<RouteMap />} />
                  <Route path="/terminal" element={<Terminal />} />
                  <Route path="/testPrice" element={<TestPrice />} />
                  <Route path="/reviewList" element={<ReviewList />} />
                  <Route path="/chatbot" element={<Chatbot />} />
                  <Route path="/chatbotEdit" element={<ChatbotEdit />} />
                  <Route path="/memberChat" element={<MemberChat />} />
                  <Route path="/refundInfo" element={<RefundInfo />} />
                  <Route path="/terminalInfo" element={<TerminalInfo />} />
                  <Route path="/charge" element={<Charge />} />
                  <Route path="/payInfo" element={<PayInfo />} />
                  <Route path="/memberList" element={<MemberList />} />
                  <Route path="/pointList" element={<PointList />} />
                  <Route path="/point" element={<Point />} />
                  <Route path="/orderEnd" element={<OrderEnd />} />
                  <Route path="/" element={<Home />} />
                  <Route path="/orderList" element={<OrderList />} />
                  <Route path="/reservationList" element={<ReservationList />} />
                </Routes>
              </Suspense>
            </div>
          </div>
          <div
            className="live-chat-wrapper"
            aria-label="Live Chat"
            role="button"
            title="Live Chat"
            tabIndex="0"
            style={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              backgroundColor: '#fff',
              padding: '10px',
              borderRadius: '5px',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
            }}
          >
            <div className="live-chat-wrapper-content" style={{ display: 'flex', alignItems: 'center' }}>
              <span className="live-chat-wrapper-iconwrapper" style={{ marginRight: '10px' }}>
                <div className="live-chat-wrapper-icon" style={{
                  width: '34px',
                  height: '34px',
                  backgroundColor: '#ccc',
                  borderRadius: '50%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  {/* 아이콘 이미지나 폰트 아이콘을 여기에 추가할 수 있습니다 */}
                  <span role="img" aria-label="chat">💬</span>
                </div>
              </span>
              <span className="live-chat-wrapper-label" style={{ fontSize: '16px' }}> 상담사 연결 </span>
            </div>
            <div id="divBadge" className="live-chat-badge" style={{
              width: '10px',
              height: '10px',
              backgroundColor: 'red',
              borderRadius: '50%',
              marginLeft: '10px'
            }}></div>
          </div>
          <div
            className="live-chat-wrapper"
            aria-label="Live Chat"
            role="button"
            title="Live Chat"
            tabIndex="0"
            style={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              backgroundColor: '#fff',
              padding: '10px',
              borderRadius: '5px',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
              bottom: '100px'
            }}
          >
            <div className="live-chat-wrapper-content" style={{ display: 'flex', alignItems: 'center' }}>
              <span className="live-chat-wrapper-iconwrapper" style={{ marginRight: '10px' }}>
                <div className="live-chat-wrapper-icon" style={{
                  width: '34px',
                  height: '34px',
                  backgroundColor: '#ccc',
                  borderRadius: '50%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  {/* 아이콘 이미지나 폰트 아이콘을 여기에 추가할 수 있습니다 */}
                  <span role="img" aria-label="chat">💬</span>
                </div>
              </span>
              <span className="live-chat-wrapper-label" style={{ fontSize: '16px' }}> 챗봇 연결 </span>
            </div>
            <div id="divBadge" className="live-chat-badge" style={{
              width: '10px',
              height: '10px',
              backgroundColor: 'red',
              borderRadius: '50%',
              marginLeft: '10px'
            }}></div>
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
