import './App.css';
import {
  Menu,
  MenuItem,
  Sidebar,
  SubMenu,
  sidebarClasses,
  menuClasses,
} from "react-pro-sidebar";


function App() {
  return (
    <>
      <Sidebar
        rootStyles={{
          [`.${sidebarClasses.container}`]: {
            backgroundColor: 'white',
            height: 1000,
          },
        }}
      >
        <div className='row mt-4' style={{ marginBlockStart: '2em', marginLeft: '5em', marginBottom: '2em' }}>
          <div className='col'>
            <img src="https://picsum.photos/100/100" alt="Sidebar Image" className='' />
          </div>
        </div>
        <Menu
          rootStyles={{
            [`.${menuClasses.subMenuRoot}`]: {
              backgroundColor: "white",
              color: "black",
            },
            [`.${menuClasses.menuItemRoot}`]: {
              backgroundColor: "white",
              color: "black",
            },
          }}
        >
          <SubMenu label="운행정보" className='mt-4'>
            <MenuItem> 시간표 조회 </MenuItem>
            <MenuItem> 도착시간 안내 </MenuItem>
          </SubMenu>
          <SubMenu label="이용안내">
            <MenuItem> 예매안내 </MenuItem>
            <MenuItem> 결제수단 안내 </MenuItem>
            <MenuItem> 승차권 환불 안내 </MenuItem>
            <MenuItem> 고속버스터미널 안내 </MenuItem>
          </SubMenu>
          <MenuItem> 공지사항 </MenuItem>
          <SubMenu label="고객센터">
            <MenuItem> 자주하는 질문 </MenuItem>
            <MenuItem> 유실물센터 안내 </MenuItem>
          </SubMenu>
        </Menu>
      </Sidebar>
    </>
  );
}

export default App;
